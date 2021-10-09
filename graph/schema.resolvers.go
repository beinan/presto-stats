package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"strconv"
	"strings"

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

func (r *mutationResolver) NewProject(ctx context.Context, input *model.NewProject) (*model.Project, error) {
	err := r.DB.CreateProject(input.ID)
	if err != nil {
		return nil, err
	}
	project, err := r.DB.GetProject(input.ID)
	return project, err
}

func (r *mutationResolver) NewBatch(ctx context.Context, input *model.NewBatch) (*model.Batch, error) {
	err := r.DB.CreateBatch(input.ProjectID, input.ID)
	if err != nil {
		return nil, err
	}
	batch, err := r.DB.GetBatch(input.ProjectID, input.ID)
	return batch, err
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
	stages := []*model.Stage{}
	pStages := &stages
	GetStages(json["outputStage"].(map[string]interface{}), pStages)
	return &model.JSONStats{
		JSON:       json,
		State:      json["state"].(string),
		SQL:        json["query"].(string),
		QueryStats: stats,
		Session:    session,
		Stages:     stages,
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

func (r *queryResolver) Batch(ctx context.Context, id string, projectID string) (*model.Batch, error) {
	batch, err := r.DB.GetBatch(projectID, id)
	return batch, err
}

// Batch returns generated.BatchResolver implementation.
func (r *Resolver) Batch() generated.BatchResolver { return &batchResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// PrestoQuery returns generated.PrestoQueryResolver implementation.
func (r *Resolver) PrestoQuery() generated.PrestoQueryResolver { return &prestoQueryResolver{r} }

// Project returns generated.ProjectResolver implementation.
func (r *Resolver) Project() generated.ProjectResolver { return &projectResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type batchResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type prestoQueryResolver struct{ *Resolver }
type projectResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func HumanTime2ms(t string) float64 {
	//TODO: make value extraction more robust
	dotPos := strings.Index(t, ".")
	val, err := strconv.ParseFloat(t[:dotPos+3], 64)
	if err != nil {
		return -1.00
	}
	dim := t[dotPos+3:]
	if dim == "ms" {
		//do nothing
	} else if dim == "us" {
		val /= 1000
	} else if dim == "ns" {
		val /= 1000000
	} else if dim == "s" {
		val *= 1000
	} else if dim == "m" {
		val *= 1000 * 60
	} else if dim == "h" {
		val *= 1000 * 60 * 60
	} else if dim == "d" {
		val *= 1000 * 3600 * 24
	} else {
		return -1.00
	}
	return val
}
func GetOperator(json map[string]interface{}) *model.Operator {
	opId := strconv.Itoa(int(json["stageId"].(float64))) + strconv.Itoa(int(json["pipelineId"].(float64))) + strconv.Itoa(int(json["operatorId"].(float64)))
	operatorType := json["operatorType"].(string)
	totalDrivers := int(json["totalDrivers"].(float64))
	addInputWall := json["addInputWall"].(string)
	getOutputWall := json["getOutputWall"].(string)
	finishWall := json["finishWall"].(string)
	avgWall := (HumanTime2ms(addInputWall) + HumanTime2ms(getOutputWall) + HumanTime2ms(finishWall)) / float64(totalDrivers)
	return &model.Operator{
		ID:            opId,
		OperatorType:  operatorType,
		TotalDrivers:  totalDrivers,
		AddInputWall:  addInputWall,
		GetOutputWall: getOutputWall,
		FinishWall:    finishWall,
		AvgWall:       avgWall,
	}
}
func GetPipeline(json map[string]interface{}) *model.Pipeline {
	pplId := strconv.Itoa(int(json["pipelineId"].(float64)))
	firstStartTime := json["firstStartTime"].(string)
	lastEndTime := json["lastEndTime"].(string)
	totalDrivers := int(json["totalDrivers"].(float64))
	totalCpuTime := json["totalCpuTime"].(string)
	avgCpuTime := HumanTime2ms(totalCpuTime) / float64(totalDrivers)
	totalBlockedTime := json["totalBlockedTime"].(string)
	avgBlockedTime := HumanTime2ms(totalBlockedTime) / float64(totalDrivers)
	operatorSummaries := json["operatorSummaries"].([]interface{})
	totalOperators := len(operatorSummaries)
	operators := make([]*model.Operator, totalOperators)
	for i := 0; i < totalOperators; i++ {
		operators[i] = GetOperator(operatorSummaries[i].(map[string]interface{}))
	}
	return &model.Pipeline{
		ID:               pplId,
		FirstStartTime:   firstStartTime,
		LastEndTime:      lastEndTime,
		TotalDrivers:     totalDrivers,
		TotalCPUTime:     totalCpuTime,
		AvgCPUTime:       avgCpuTime,
		TotalBlockedTime: totalBlockedTime,
		AvgBlockedTime:   avgBlockedTime,
		TotalOperators:   totalOperators,
		Operators:        operators,
	}
}
func GetTask(stageId string, json map[string]interface{}) *model.Task {
	self := json["taskStatus"].(map[string]interface{})["self"].(string)
	dotPos := strings.LastIndex(self, ".")
	taskId := stageId + "." + self[dotPos+1:]
	stats := json["stats"].(map[string]interface{})
	createTime := stats["createTime"].(string)
	endTime := stats["endTime"].(string)
	elapsedTime := stats["elapsedTime"].(string)
	totalDrivers := int(stats["totalDrivers"].(float64))
	totalCpuTime := stats["totalCpuTime"].(string)
	avgCpuTime := HumanTime2ms(totalCpuTime) / float64(totalDrivers)
	totalBlockedTime := stats["totalBlockedTime"].(string)
	avgBlockedTime := HumanTime2ms(totalBlockedTime) / float64(totalDrivers)
	pipelinesSlice := stats["pipelines"].([]interface{})
	totalPipelines := len(pipelinesSlice)
	pipelines := make([]*model.Pipeline, totalPipelines)
	for i := 0; i < totalPipelines; i++ {
		pipelines[i] = GetPipeline(pipelinesSlice[i].(map[string]interface{}))
	}
	return &model.Task{
		ID:               taskId,
		CreateTime:       createTime,
		EndTime:          endTime,
		ElapsedTime:      elapsedTime,
		TotalDrivers:     totalDrivers,
		TotalCPUTime:     totalCpuTime,
		AvgCPUTime:       avgCpuTime,
		TotalBlockedTime: totalBlockedTime,
		AvgBlockedTime:   avgBlockedTime,
		TotalPipelines:   totalPipelines,
		Pipelines:        pipelines,
	}
}
func GetStage(json map[string]interface{}) *model.Stage {
	pos := strings.LastIndex(json["stageId"].(string), ".")
	stageId := json["stageId"].(string)[pos+1:]
	stageStats := json["stageStats"].(map[string]interface{})
	totalDrivers := int(stageStats["totalDrivers"].(float64))
	totalCpuTime := stageStats["totalCpuTime"].(string)
	avgCpuTime := HumanTime2ms(totalCpuTime) / float64(totalDrivers)
	totalBlockedTime := stageStats["totalBlockedTime"].(string)
	avgBlockedTime := HumanTime2ms(totalBlockedTime) / float64(totalDrivers)
	tasksSlice := json["tasks"].([]interface{})
	totalTasks := len(tasksSlice)
	tasks := make([]*model.Task, totalTasks)
	for i := 0; i < totalTasks; i++ {
		tasks[i] = GetTask(stageId, tasksSlice[i].(map[string]interface{}))
	}

	return &model.Stage{
		ID:               stageId,
		TotalDrivers:     totalDrivers,
		TotalCPUTime:     totalCpuTime,
		AvgCPUTime:       avgCpuTime,
		TotalBlockedTime: totalBlockedTime,
		AvgBlockedTime:   avgBlockedTime,
		TotalTasks:       totalTasks,
		Tasks:            tasks,
	}
}
func GetStages(json map[string]interface{}, pStage *[]*model.Stage) {
	pos := strings.LastIndex(json["stageId"].(string), ".")
	stageId := json["stageId"].(string)[pos+1:]
	stageStats := json["stageStats"].(map[string]interface{})
	totalDrivers := int(stageStats["totalDrivers"].(float64))
	totalCpuTime := stageStats["totalCpuTime"].(string)
	avgCpuTime := HumanTime2ms(totalCpuTime) / float64(totalDrivers)
	totalBlockedTime := stageStats["totalBlockedTime"].(string)
	avgBlockedTime := HumanTime2ms(totalBlockedTime) / float64(totalDrivers)
	tasksSlice := json["tasks"].([]interface{})
	totalTasks := len(tasksSlice)
	tasks := make([]*model.Task, totalTasks)
	for i := 0; i < totalTasks; i++ {
		tasks[i] = GetTask(stageId, tasksSlice[i].(map[string]interface{}))
	}
	stage := model.Stage{
		ID:               stageId,
		TotalDrivers:     totalDrivers,
		TotalCPUTime:     totalCpuTime,
		AvgCPUTime:       avgCpuTime,
		TotalBlockedTime: totalBlockedTime,
		AvgBlockedTime:   avgBlockedTime,
		TotalTasks:       totalTasks,
		Tasks:            tasks,
	}
	*pStage = append(*pStage, &stage)
	subStagesSlice := json["subStages"].([]interface{})
	for _, s := range subStagesSlice {
		GetStages(s.(map[string]interface{}), pStage)
	}
}
