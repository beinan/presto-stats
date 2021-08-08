package model

type PrestoQuery struct {
	ID        string `json:"id"`
	BatchID   string `json:"batch"`
	ProjectID string
}
