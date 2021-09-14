# Presto Visualizer 

## Backend Service
The backend service is based on https://github.com/99designs/gqlgen

### Start the server
```shell
go run server.go -dataPath=${stats_data_path}
```

### Play Ground of GraphQL
Visit http://localhost:8888/


### Define GraphQL Schema
The schema is defined at `${project_root}/graph.schema.graphqls`
More details: https://graphql.org/

### Generate GraphQL code
Run the command below once you finish the change on `${project_root}/graph.schema.graphqls`

```shell
go run github.com/99designs/gqlgen generate
```


## Frontend UI
The frontend UI is built on react.

Note: the frontend project is located at `${project_root}/dashboard-ui`

### Start 

```shell
cd dashboard-ui
yarn start
```
Visit http://localhost:3000 , you would see the UI of Presto Visualizer


### Depanencies

* Frontend Framework: React
* UI component: Reactramp
* State management: Redux
* GraphQL client: apollo graphql
* Chart: ApexChart
 