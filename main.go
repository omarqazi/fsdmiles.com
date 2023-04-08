package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

const (
	startMiles      = 130000000.0 // Starting number of miles driven
	startDateString = "2023-04-06T20:00:00Z"
	milesPerDay     = 1000000.0 // Miles driven per day
	milesPerSecond  = milesPerDay / 24 / 60 / 60
	wwwDirectory    = "./www"
)

var (
	startDate time.Time
)

func init() {
	var err error
	startDate, err = time.Parse(time.RFC3339, startDateString)
	if err != nil {
		log.Fatalf("Failed to parse start date: %v", err)
	}
}

func extrapolateMiles(targetDate time.Time) float64 {
	daysSinceStart := targetDate.Sub(startDate).Hours() / 24.0
	return startMiles + daysSinceStart*milesPerDay
}

func milesHandler(w http.ResponseWriter, r *http.Request) {
	queryDate := r.URL.Query().Get("date")
	var targetDate time.Time
	var err error

	if queryDate == "" {
		targetDate = time.Now()
	} else {
		targetDate, err = time.Parse(time.RFC3339, queryDate)
		if err != nil {
			http.Error(w, "Invalid date format. Use RFC3339.", http.StatusBadRequest)
			return
		}
	}

	miles := extrapolateMiles(targetDate)

	milesData := struct {
		Miles          float64   `json:"miles"`
		MilesPerDay    float64   `json:"miles_per_day"`
		MilesPerSecond float64   `json:"miles_per_second"`
		GeneratedTime  time.Time `json:"time_generated"`
	}{
		Miles:          miles,
		MilesPerDay:    milesPerDay,
		MilesPerSecond: milesPerSecond,
		GeneratedTime:  targetDate,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(milesData)
}

func main() {
	http.Handle("/", http.FileServer(http.Dir(wwwDirectory)))
	http.HandleFunc("/miles.json", milesHandler)

	fmt.Println("Starting server on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
