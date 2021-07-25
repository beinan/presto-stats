package model

type Project struct {
	ID       string   `json:"id"`
	BatchIDs []string `json:"batches"`
}
