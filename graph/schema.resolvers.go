package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"alluxio.com/presto-stats/graph/generated"
	"alluxio.com/presto-stats/graph/model"
)

func (r *batchResolver) Project(ctx context.Context, obj *model.Batch) (*model.Project, error) {
	project, err := r.DB.GetProject(obj.ProjectID)
	return project, err
}

func (r *batchResolver) Queries(ctx context.Context, obj *model.Batch) ([]*model.PrestoQuery, error) {
	results := make([]*model.PrestoQuery, len(obj.QueryIDs))
	for i, queryID := range obj.QueryIDs {
		results[i] = &model.PrestoQuery{ID: queryID, BatchID: obj.ID, ProjectID: obj.ProjectID}
	}
	return results, nil
}

func (r *prestoQueryResolver) Batch(ctx context.Context, obj *model.PrestoQuery) (*model.Batch, error) {
	batch, err := r.DB.GetBatch(obj.ProjectID, obj.BatchID)
	return batch, err
}

func (r *prestoQueryResolver) JSONStats(ctx context.Context, obj *model.PrestoQuery) (*model.JSONStats, error) {
	json, err := r.DB.ReadJson(obj.ProjectID, obj.BatchID, obj.ID)
	if err != nil {
		return nil, err
	}
	stats := json["queryStats"].(map[string]interface{})
	session := json["session"].(map[string]interface{})
	return &model.JSONStats{
		JSON:       json,
		State:      json["state"].(string),
		SQL:        json["query"].(string),
		QueryStats: stats,
		Session:    session,
	}, nil
}

func (r *projectResolver) Batches(ctx context.Context, obj *model.Project) ([]*model.Batch, error) {
	batches, err := r.DB.GetBatches(obj.ID)
	return batches, err
}

func (r *queryResolver) Projects(ctx context.Context) ([]*model.Project, error) {
	fmt.Println("Listing Projects")
	projects, err := r.DB.GetProjects()
	return projects, err
}

func (r *queryResolver) Project(ctx context.Context, id string) (*model.Project, error) {
	fmt.Println("Get Project:" + id)
	project, err := r.DB.GetProject(id)
	return project, err
}

// Batch returns generated.BatchResolver implementation.
func (r *Resolver) Batch() generated.BatchResolver { return &batchResolver{r} }

// PrestoQuery returns generated.PrestoQueryResolver implementation.
func (r *Resolver) PrestoQuery() generated.PrestoQueryResolver { return &prestoQueryResolver{r} }

// Project returns generated.ProjectResolver implementation.
func (r *Resolver) Project() generated.ProjectResolver { return &projectResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type batchResolver struct{ *Resolver }
type prestoQueryResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
