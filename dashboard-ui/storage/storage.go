package storage

import "alluxio.com/presto-stats/graph/model"

// define a interface for storage
type Storage interface {
	GetProjects() ([]*model.Project, error)
	GetProject(projectID string) (*model.Project, error)
	CreateProject(projectID string) error
	CreateBatch(projectID string, batchID string) error
	GetBatches(projectID string) ([]*model.Batch, error)
	GetBatch(projectID string, batchID string) (*model.Batch, error)
	ReadJson(projectID string, batchID string, queryID string) (map[string]interface{}, error)
}
