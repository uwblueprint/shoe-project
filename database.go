package main

// import (
// 	"encoding/json"

// 	"log"

// 	"net/http"

// 	"github.com/gorilla/mux"

// 	"github.com/jinzhu/gorm"

// 	"github.com/rs/cors"

// 	_ "github.com/jinzhu/gorm/dialects/postgres"
// )

// type Author struct {
// 	gorm.Model

// 	FirstName string

// 	LastName string

// 	Bio string

// 	Origin string

// 	Stories []Story
// }

// type Story struct {
// 	gorm.Model

// 	Name string

// 	DateCreated string

// 	DateUpdated string

// 	City string

// 	// Pin string

// 	// Images []string

// 	// Audio []string

// 	// Video []string

// 	// Context string

// 	// AuthorID int
// }

// var db *gorm.DB

// var err error
// var (
// 	authors = []Author{
// 		{FirstName: "Dinu", LastName: "Wijetunga", Bio: "Hello World", Origin: "Toronto"},
// 		{FirstName: "John", LastName: "Doe", Bio: "Hello John", Origin: "Vancouver"},
// 		{FirstName: "Jane", LastName: "Doe", Bio: "Hello Jane", Origin: "Miami"},
// 		{FirstName: "Sam", LastName: "Doe", Bio: "Hello Sam", Origin: "Moscow"},
// 	}

// 	stories = []Story{
// 		{Name: "Blog", DateCreated: "02/10/2020", DateUpdated: "02/10/2020", City: "Toronto"},
// 		{Name: "Blog1", DateCreated: "02/10/2020", DateUpdated: "02/10/2020", City: "Vancouver"},
// 		{Name: "Blog2", DateCreated: "02/10/2020", DateUpdated: "02/10/2020", City: "Miami"},
// 		{Name: "Blog3", DateCreated: "02/10/2020", DateUpdated: "02/10/2020", City: "Moscow"},
// 		{Name: "Blog4", DateCreated: "02/10/2020", DateUpdated: "02/10/2020", City: "Toronto"},
// 	}
// )

// func main() {
// 	router := mux.NewRouter()

// 	db, err = gorm.Open("postgres", "host=db port=5432 user=postgres dbname=postgres sslmode=disable password=postgres")

// 	if err != nil {
// 		panic("failed to connect to databse")
// 	}

// 	defer db.Close()

// 	db.AutoMigrate(&Author{})

// 	db.AutoMigrate(&Story{})

// 	for index := range stories {
// 		db.Create(&stories[index])
// 	}

// 	for index := range authors {
// 		db.Create(&authors[index])
// 	}

// 	router.HandleFunc("/stories", GetStories).Methods("GET")
// 	router.HandleFunc("/stories/{id}", GetStory).Methods("GET")
// 	router.HandleFunc("/authors/{id}", GetAuthor).Methods("GET")
// 	router.HandleFunc("/drivers/{id}", DeleteStory).Methods("DELETE")

// 	handler := cors.Default().Handler(router)

// 	log.Fatal(http.ListenAndServe(":8080", handler))

// }

// func GetStories(w http.ResponseWriter, r *http.Request) {

// 	var stories []Story

// 	db.Find(&stories)

// 	json.NewEncoder(w).Encode(&stories)
// }

// func GetStory(w http.ResponseWriter, r *http.Request) {

// 	params := mux.Vars(r)

// 	var story Story

// 	db.First(&story, params["id"])

// 	json.NewEncoder(w).Encode(&story)
// }

// func GetAuthor(w http.ResponseWriter, r *http.Request) {

// 	params := mux.Vars(r)

// 	var author Author

// 	var stories []Story

// 	db.First(&author, params["id"])

// 	db.Model(&author).Related(&stories)

// 	author.Stories = stories

// 	json.NewEncoder(w).Encode(&author)
// }

// func DeleteStory(w http.ResponseWriter, r *http.Request) {

// 	params := mux.Vars(r)

// 	var story Story
// 	db.First(&story, params["id"])
// 	db.Delete(&story)

// 	var stories []Story

// 	db.Find(&stories)

// 	json.NewEncoder(w).Encode(&stories)
// }
