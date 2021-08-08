package model

type Batch struct {
	ID        string   `json:"id"`
	ProjectID string   `json:"project"`
	QueryIDs  []string `json:"queries"`
}
