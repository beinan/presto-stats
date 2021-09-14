package storage

import (
	"encoding/json"
	"io/fs"
	"io/ioutil"
	"os"
	"path"
	"strings"

	"alluxio.com/presto-stats/graph/model"
)

type LocalFileDB struct {
	Root string
}

func (db *LocalFileDB) GetProjects() ([]*model.Project, error) {
	subFolders, err := ioutil.ReadDir(db.Root)
	if err != nil {
		return nil, err
	}

	var results []*model.Project
	for _, subFolder := range subFolders {
		if subFolder.IsDir() {
			projectID := subFolder.Name()
			project, err := db.GetProject(projectID)
			if err != nil {
				return nil, err
			}
			results = append(results, project)
		}
	}
	return results, nil
}

func (db *LocalFileDB) GetProject(projectID string) (*model.Project, error) {
	batchFolders, err := ioutil.ReadDir(path.Join(db.Root, projectID))
	if err != nil {
		return nil, err
	}
	var batchIDs []string
	for _, batchFolder := range batchFolders {
		if batchFolder.IsDir() {
			batchIDs = append(batchIDs, batchFolder.Name())
		}
	}
	return &model.Project{ID: projectID, BatchIDs: batchIDs}, nil
}

func (db *LocalFileDB) CreateProject(projectID string) error {
	path := path.Join(db.Root, projectID)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.Mkdir(path, 0755)
		return err
	} else {
		return fs.ErrExist
	}
}

func (db *LocalFileDB) GetBatches(projectID string) ([]*model.Batch, error) {
	subFolders, err := ioutil.ReadDir(path.Join(db.Root, projectID))
	if err != nil {
		return nil, err
	}

	var results []*model.Batch
	for _, subFolder := range subFolders {
		if subFolder.IsDir() {
			batchID := subFolder.Name()
			batch, err := db.GetBatch(projectID, batchID)
			if err != nil {
				return nil, err
			}
			results = append(results, batch)
		}
	}
	return results, nil
}

func (db *LocalFileDB) GetBatch(projectID string, batchID string) (*model.Batch, error) {
	queryJsonFiles, err := ioutil.ReadDir(path.Join(db.Root, projectID, batchID))
	if err != nil {
		return nil, err
	}
	var queryIDs []string
	for _, queryJsonFile := range queryJsonFiles {
		if strings.HasSuffix(queryJsonFile.Name(), ".json") {
			queryIDs = append(queryIDs, queryJsonFile.Name())
		}
	}
	return &model.Batch{ID: batchID, ProjectID: projectID, QueryIDs: queryIDs}, nil
}

func (db *LocalFileDB) ReadJson(projectID string, batchID string, queryID string) (map[string]interface{}, error) {
	queryJsonBytes, err := ioutil.ReadFile(path.Join(db.Root, projectID, batchID, queryID))
	if err != nil {
		return nil, err
	}
	var result map[string]interface{}
	json.Unmarshal([]byte(queryJsonBytes), &result)
	return result, nil
}
