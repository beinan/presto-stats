package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strconv"

	"alluxio.com/presto-stats/graph/generated"
	"alluxio.com/presto-stats/graph/model"
	"github.com/beinan/fastid"
)

func (r *mutationResolver) CreateProject(ctx context.Context, input model.NewProject) (*model.Project, error) {
	project := model.Project{
		ID:       input.Name,
		BatchIDs: make([]string, 0),
	}
	err := r.DB.Create("project", project.ID, &project)
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *mutationResolver) CreateBatch(ctx context.Context, input model.NewBatch) (*model.Batch, error) {
	id := strconv.FormatInt(fastid.CommonConfig.GenInt64ID(), 16)
	batch := model.Batch{
		ID:   id,
		Text: input.Text,
		Done: false,
	}
	err := r.DB.Create("batch", id, &batch)
	if err != nil {
		return nil, err
	}
	project := model.Project{}
	err = r.DB.Get("project", input.ProjectName, &project)
	if err != nil {
		return nil, err
	}
	project.BatchIDs = append(project.BatchIDs, id)
	err = r.DB.Update("project", project.ID, &project)
	if err != nil {
		return nil, err
	}
	return &batch, nil
}

func (r *projectResolver) Batches(ctx context.Context, obj *model.Project) ([]*model.Batch, error) {
	batches := make([]*model.Batch, len(obj.BatchIDs))

	for i, id := range obj.BatchIDs {
		batch := model.Batch{}
		err := r.DB.Get("batch", id, &batch)
		if err != nil {
			return nil, err
		}
		batches[i] = &batch
	}
	return batches, nil
}

func (r *queryResolver) Project(ctx context.Context, id string) (*model.Project, error) {
	project := model.Project{}
	err := r.DB.Get("project", id, &project)
	if err != nil {
		return nil, err
	}
	return &project, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Project returns generated.ProjectResolver implementation.
func (r *Resolver) Project() generated.ProjectResolver { return &projectResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *projectResolver) ID(ctx context.Context, obj *model.Project) (string, error) {
	panic(fmt.Errorf("not implemented"))
}
