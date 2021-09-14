package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"alluxio.com/presto-stats/dashboard-ui/storage"
	"alluxio.com/presto-stats/graph"
	"alluxio.com/presto-stats/graph/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {

	dataPathFlag := flag.String("dataPath", "./data", "path to the stats data")
	portFlag := flag.Int("port", 8888, "GraphQL service port")

	flag.Parse()

	db := storage.LocalFileDB{Root: *dataPathFlag}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%d/ for GraphQL playground", *portFlag)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *portFlag), nil))
}
