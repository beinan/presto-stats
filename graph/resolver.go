package graph

import "alluxio.com/presto-stats/dashboard-ui/storage"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB storage.LocalFileDB
}
