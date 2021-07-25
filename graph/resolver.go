package graph

import (
	"alluxio.com/presto-stats/graph/db"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB db.DB
}
