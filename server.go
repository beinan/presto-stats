package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"alluxio.com/presto-stats/dashboard-ui/storage"
	"alluxio.com/presto-stats/graph"
	"alluxio.com/presto-stats/graph/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/akrylysov/algnhsa"
	"github.com/rs/cors"
)

func newResolver() *graph.Resolver {
	dbType := os.Getenv("DB_TYPE")
	switch dbType {
	case "s3":
		db := storage.S3DB{}
		db.Init()
		return &graph.Resolver{DB: &db}
	default:
		dataPathFlag := flag.String("dataPath", "./data", "path to the stats data")
		db := storage.LocalFileDB{Root: *dataPathFlag}
		return &graph.Resolver{DB: &db}
	}
}

func main() {

	portFlag := flag.Int("port", 8888, "GraphQL service port")

	flag.Parse()

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: newResolver()}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Println("connect to GraphQL playground")

	if os.Getenv("RUN_LAMBDA") == "true" {
		corsHandler := cors.Default().Handler(http.DefaultServeMux)
		algnhsa.ListenAndServe(corsHandler, nil)
	} else {
		log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *portFlag), nil))
	}

}
