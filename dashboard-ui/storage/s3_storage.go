package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"

	"alluxio.com/presto-stats/graph/model"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type InMemoryQuery struct {
	ID        string
	Persisted bool
}

type InMemoryBatch struct {
	ID      string
	Queries map[string]*InMemoryQuery
}

type InMemroyProject struct {
	ID      string
	Batches map[string]*InMemoryBatch
}

type S3DB struct {
	Bucket   string
	S3       *s3.S3
	Projects map[string]*InMemroyProject
}

func (db *S3DB) Init() {
	db.Bucket = os.Getenv("AWS_BUCKET")
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"),
	}))
	db.S3 = s3.New(sess)
	db.Projects = make(map[string]*InMemroyProject)
	s3Objects, err := db.S3.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(db.Bucket),
	})
	if err != nil {
		panic(err)
	}
	for _, s3Object := range s3Objects.Contents {
		objectKey := *s3Object.Key
		projectID := strings.Split(objectKey, "/")[0]
		batchID := strings.Split(objectKey, "/")[1]
		queryID := strings.Split(objectKey, "/")[2]
		if _, ok := db.Projects[projectID]; !ok {
			db.Projects[projectID] = &InMemroyProject{
				ID:      projectID,
				Batches: make(map[string]*InMemoryBatch)}
		}
		if _, ok := db.Projects[projectID].Batches[batchID]; !ok {
			db.Projects[projectID].Batches[batchID] = &InMemoryBatch{
				ID:      batchID,
				Queries: make(map[string]*InMemoryQuery)}
		}
		db.Projects[projectID].Batches[batchID].Queries[queryID] = &InMemoryQuery{
			ID:        queryID,
			Persisted: true,
		}
	}
}

func (db *S3DB) GetProjects() ([]*model.Project, error) {
	var projects []*model.Project
	for _, project := range db.Projects {
		projects = append(projects, &model.Project{ID: project.ID})
	}
	return projects, nil
}

func (db *S3DB) GetProject(projectID string) (*model.Project, error) {
	if project, ok := db.Projects[projectID]; ok {
		var batchIDs []string
		for _, batch := range project.Batches {
			batchIDs = append(batchIDs, batch.ID)
		}
		return &model.Project{ID: project.ID, BatchIDs: batchIDs}, nil
	} else {
		return nil, errors.New("projectID not found")
	}
}

func (db *S3DB) CreateProject(projectID string) error {
	if _, ok := db.Projects[projectID]; ok {
		return errors.New("projectID already exists")
	} else {
		db.Projects[projectID] = &InMemroyProject{
			ID:      projectID,
			Batches: make(map[string]*InMemoryBatch)}
		return nil
	}
}

func (db *S3DB) CreateBatch(projectID string, batchID string) error {
	if _, ok := db.Projects[projectID]; !ok {
		return errors.New("projectID not found")
	}
	if _, ok := db.Projects[projectID].Batches[batchID]; ok {
		return errors.New("batchID already exists")
	} else {
		db.Projects[projectID].Batches[batchID] = &InMemoryBatch{
			ID:      batchID,
			Queries: make(map[string]*InMemoryQuery)}
		return nil
	}
}

func (db *S3DB) GetBatches(projectID string) ([]*model.Batch, error) {
	if project, ok := db.Projects[projectID]; ok {
		var batches []*model.Batch
		for _, batch := range project.Batches {
			batches = append(batches, &model.Batch{ID: batch.ID, ProjectID: projectID})
		}
		return batches, nil
	} else {
		return nil, errors.New("projectID not found")
	}
}

func (db *S3DB) GetBatch(projectID string, batchID string) (*model.Batch, error) {
	if project, ok := db.Projects[projectID]; !ok {
		return nil, errors.New("projectID not found")
	} else if batch, ok := project.Batches[batchID]; !ok {
		return nil, errors.New("batchID not found")
	} else {
		var queryIDs []string
		for _, query := range batch.Queries {
			queryIDs = append(queryIDs, query.ID)
		}
		return &model.Batch{ID: batch.ID, ProjectID: projectID, QueryIDs: queryIDs}, nil
	}
}

func (db *S3DB) ReadJson(projectID string, batchID string, queryID string) (map[string]interface{}, error) {
	if project, ok := db.Projects[projectID]; !ok {
		return nil, errors.New("projectID not found")
	} else if batch, ok := project.Batches[batchID]; !ok {
		return nil, errors.New("batchID not found")
	} else if _, ok := batch.Queries[queryID]; !ok {
		return nil, errors.New("queryID not found")
	} else {
		objectKey := fmt.Sprintf("%s/%s/%s", projectID, batchID, queryID)
		s3Object, err := db.S3.GetObject(&s3.GetObjectInput{
			Bucket: aws.String(db.Bucket),
			Key:    aws.String(objectKey),
		})
		if err != nil {
			return nil, err
		}
		defer s3Object.Body.Close()
		var result map[string]interface{}
		err = json.NewDecoder(s3Object.Body).Decode(&result)
		if err != nil {
			return nil, err
		}
		return result, nil
	}
}
