package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/kataras/iris/v12"
)

type OperatorSummary struct {
	InputWall, OutputWall, FinishWall time.Duration
	Name                              string
}

func main() {
	// app := iris.New()

	// statsAPI := app.Party("/stats")
	// {
	// 	statsAPI.Use(iris.Compression)

	// 	// GET: http://localhost:8080/stats/listQueries
	// 	statsAPI.Get("/listQueries", listQueries)

	// }

	// app.Listen(":8080")
	// query := result["query"]

	// fmt.Println(query)
	compare(readJson("/Users/beinan/Downloads/Jsons/L8_2.json"), readJson("/Users/beinan/Downloads/Jsons/L8_Hive_Caching_2.json"))

	//
	// fmt.Println("Escape Time", queryStats["elapsedTime"])
	// fmt.Println("Execution Time", queryStats["executionTime"])
	// fmt.Println("Physical Input Read Time", queryStats["physicalInputReadTime"])
	// fmt.Println("physicalInputDataSize", queryStats["physicalInputDataSize"])

}

func listQueries(ctx iris.Context) {
	//ctx.JSON()
}

func readJson(path string) map[string]interface{} {
	jsonFile, err := os.Open(path)

	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	return result
}

func compare(json1 map[string]interface{}, json2 map[string]interface{}) {
	sumMap1 := calOpSumary(json1)
	sumMap2 := calOpSumary(json2)
	for key, sum1 := range sumMap1 {
		sum2 := sumMap2[key]
		fmt.Println(key,
			sum1.InputWall, sum2.InputWall, diff(sum1.InputWall, sum2.InputWall),
			sum1.OutputWall, sum2.OutputWall, diff(sum1.OutputWall, sum2.OutputWall),
			sum1.FinishWall, sum2.FinishWall, diff(sum1.FinishWall, sum2.FinishWall))
	}
}

func diff(old, new time.Duration) (delta float64) {
	diff := float64(new - old)
	delta = (diff / float64(old)) * 100
	return
}

func calOpSumary(json map[string]interface{}) map[string]OperatorSummary {
	queryStats := json["queryStats"].(map[string]interface{})
	operatorSummaries := queryStats["operatorSummaries"].([]interface{})

	result := make(map[string]OperatorSummary)
	for _, elem := range operatorSummaries {
		operatorSummary := elem.(map[string]interface{})
		name := operatorSummary["operatorType"].(string)
		inputWall, _ := time.ParseDuration(operatorSummary["addInputWall"].(string))
		outputWall, _ := time.ParseDuration(operatorSummary["getOutputWall"].(string))
		finishWall, _ := time.ParseDuration(operatorSummary["finishWall"].(string))
		if sum, ok := result[name]; ok {
			sum.InputWall += inputWall
			sum.OutputWall += outputWall
			sum.FinishWall += finishWall
			result[name] = sum
		} else {
			result[name] = OperatorSummary{InputWall: inputWall, OutputWall: outputWall, FinishWall: finishWall, Name: name}
		}

		//fmt.Println(i, operatorSummary["operatorType"], operatorSummary["addInputWall"], operatorSummary["getOutputWall"], operatorSummary["finishWall"])
	}
	return result
}
