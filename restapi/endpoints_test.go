package restapi

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/suite"
	"github.com/uwblueprint/shoe-project/internal/database/migrations"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/testutils"
	"gorm.io/gorm"
)

type endpointTestSuite struct {
	suite.Suite
	endpoint *httpexpect.Expect
	db       *gorm.DB
}

func (suite *endpointTestSuite) SetupSuite() {
	db, err := testutils.CreateMemDatabase()
	if err != nil {
		suite.Fail("error while creating database", err)
	}
	suite.db = db

	// setup required for jwt authentication
	viper.SetDefault("auth.jwt_key", testutils.JWTKey)
	viper.SetDefault("auth.jwt_expiry", testutils.JWTExpiry)
	viper.SetDefault("auth.jwt_issuer", testutils.JWTIssuer)

	router, err := Router(db, testutils.MockLocationFinder{})
	if err != nil {
		suite.FailNow("error while creating router", err)
	}

	server := httptest.NewServer(router)
	suite.endpoint = httpexpect.New(suite.T(), server.URL)
}

func (suite *endpointTestSuite) SetupTest() {
	if err := migrations.CreateTables(suite.db); err != nil {
		suite.Fail("error while creating tables", err)
	}
}

func (suite *endpointTestSuite) TearDownTest() {
	if err := testutils.DropTables(suite.db); err != nil {
		suite.Fail("error while dropping tables", err)
	}
}

func (suite *endpointTestSuite) TestHealthCheck() {
	suite.endpoint.GET("/health").
		Expect().
		Status(http.StatusOK).JSON().Object().Value("message").String().Equal("Hello World")
}

func (suite *endpointTestSuite) TestReturnStoriesByCountries() {
	json := []models.Story{
		{
			Title:           "Half of a Yellow Sun",
			Content:         "Fiction",
			AuthorFirstName: "Chimamanda",
			AuthorLastName:  "Ngozi Adieche",
			AuthorCountry:   "Nigeria",
			CurrentCity:     "Toronto",
		},
		{
			Title:           "Jane Eyre",
			Content:         "Classic",
			AuthorFirstName: "Charlotte",
			AuthorLastName:  "Bronte",
			AuthorCountry:   "UK",
			CurrentCity:     "Montreal",
		},
	}

	suite.db.Create(&json)

	var response = suite.endpoint.GET("/stories/countries=France,Nigeria,UK").
		Expect().
		Status(http.StatusOK).JSON()

	response.Object().Value("payload").Array().Length().Equal(2)

	response.Object().Value("payload").Array().Element(0).Object().Value("author_first_name").Equal("Chimamanda")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_last_name").Equal("Ngozi Adieche")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_country").Equal("Nigeria")
	response.Object().Value("payload").Array().Element(0).Object().Value("content").Equal("Fiction")
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("Half of a Yellow Sun")
	response.Object().Value("payload").Array().Element(0).Object().Value("current_city").Equal("Toronto")

	response.Object().Value("payload").Array().Element(1).Object().Value("author_first_name").Equal("Charlotte")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_last_name").Equal("Bronte")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_country").Equal("UK")
	response.Object().Value("payload").Array().Element(1).Object().Value("content").Equal("Classic")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Jane Eyre")
	response.Object().Value("payload").Array().Element(1).Object().Value("current_city").Equal("Montreal")
}

func (suite *endpointTestSuite) TestReturnAllUniqueTags() {
	json := []models.Tag{
		{
			Name:    "EDUCATION",
			StoryID: 1,
		},
		{
			Name:    "REFUGEE",
			StoryID: 2,
		},
		{
			Name:    "EDUCATION",
			StoryID: 2,
		},
	}

	suite.db.Create(&json)

	var response = suite.endpoint.GET("/tags").
		Expect().
		Status(http.StatusOK).JSON()

	//TEST FAILS here b/c extra table value "IMMIGRATION" gets added in "TestGetVisibleStoriesWithTags" below
	response.Object().Value("payload").Array().Length().Equal(2)
	response.Object().Value("payload").Array().Element(0).Equal("EDUCATION")
	response.Object().Value("payload").Array().Element(1).Equal("REFUGEE")
}

func GetStoriesToTest() []models.Story {
	jsonStories := []models.Story{
		{
			Title:           "The Little Prince",
			Content:         "Children",
			Year:            2012,
			IsVisible:       true,
			Summary:         "Summary1",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			VideoURL:        "https://youtube.com",
			AuthorFirstName: "John",
			AuthorLastName:  "Doe",
			AuthorCountry:   "France",
		},
		{
			Title:           "Hitchhiker's Guide to the Galaxy",
			Content:         "Fiction",
			Year:            2017,
			IsVisible:       true,
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "John",
			AuthorLastName:  "Adams",
			AuthorCountry:   "France",
		},
		{
			Title:           "Batman Begins",
			Content:         "Fiction",
			Year:            2014,
			IsVisible:       true,
			Summary:         "Summary3",
			CurrentCity:     "Vancouver",
			ImageURL:        "https://bat.com",
			AuthorFirstName: "Bruce",
			AuthorLastName:  "Wayne",
			AuthorCountry:   "USA",
		},
		{
			Title:           "Pulp Fiction",
			Content:         "Fiction",
			Year:            1999,
			IsVisible:       true,
			Summary:         "Summary3",
			CurrentCity:     "Edmonton",
			ImageURL:        "https://bat.com",
			AuthorFirstName: "Clark",
			AuthorLastName:  "Kent",
			AuthorCountry:   "Canada",
		},
		{
			Title:           "Invisible Story",
			Content:         "Fiction",
			Year:            2012,
			IsVisible:       false,
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Douglas",
			AuthorLastName:  "Adams",
			AuthorCountry:   "UK",
		},
		{
			Title:           "Spiderman",
			Content:         "Fiction",
			Year:            2016,
			IsVisible:       false,
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Douglas",
			AuthorLastName:  "Adams",
			AuthorCountry:   "Canada",
		},
		{
			Title:           "Casper The Ghost",
			Content:         "Fiction",
			Year:            2012,
			IsVisible:       false,
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Barry",
			AuthorLastName:  "Allen",
			AuthorCountry:   "UK",
		},
	}
	return jsonStories
}

func GetAuthorsToTest() []models.Author {
	jsonAuthors := []models.Author{
		{
			FirstName:     "John",
			LastName:      "Doe",
			OriginCountry: "France",
			Bio:           "bio1",
		},
		{
			FirstName:     "John",
			LastName:      "Adams",
			OriginCountry: "France",
			Bio:           "bio2",
		},
		{
			FirstName:     "Bruce",
			LastName:      "Wayne",
			OriginCountry: "USA",
			Bio:           "bio3",
		},
		{
			FirstName:     "Clark",
			LastName:      "Kent",
			OriginCountry: "Canada",
			Bio:           "bio4",
		},
		{
			FirstName:     "Douglas",
			LastName:      "Adams",
			OriginCountry: "UK",
			Bio:           "bio5",
		},
		{
			FirstName:     "Douglas",
			LastName:      "Adams",
			OriginCountry: "Canada",
			Bio:           "bio6",
		},
		{
			FirstName:     "Barry",
			LastName:      "Allen",
			OriginCountry: "UK",
			Bio:           "bio7",
		},
	}
	return jsonAuthors
}

func (suite *endpointTestSuite) TestGetAllStories() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()

	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)

	var response = suite.endpoint.GET("/stories").
		Expect().
		Status(http.StatusOK).JSON()

	mock := `{
		"payload": [
		{
			"author_first_name": "Antoine",
			"author_last_name": "dSE",
			"author_country": "France",
			"content": "Children",
			"title": "The Little Prince",
			"year": 2012,
			"is_visible": true,
			"summary": "Summary1",
			"current_city": "Toronto",
			"image_url" : "https://exampleurl.com",
			"video_url":"https://youtube.com",
			"tags": []
		},
		{
			"author_first_name": "Douglas",
			"author_last_name": "Adams",
			"author_country": "UK",
			"content": "Fiction",
			"title": "Hitchhiker's Guide to the Galaxy",
			"year": 2012,
			"is_visible": true,
			"summary": "Summary2",
			"current_city": "Toronto",
			"image_url" : "https://exampleurl.com",
			"video_url": "",
			"tags": []
		}
		],
		"status": "OK"
	}`

	//Verify response matches
	response.Schema(mock)
	response.Object().Value("payload").Array().Length().Equal(4)

	response.Object().Value("payload").Array().Element(0).Object().Value("author_first_name").Equal("John")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_last_name").Equal("Doe")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_country").Equal("France")
	response.Object().Value("payload").Array().Element(0).Object().Value("ID").Equal(1)
	response.Object().Value("payload").Array().Element(0).Object().Value("content").Equal("Children")
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(0).Object().Value("year").Equal(2012)
	response.Object().Value("payload").Array().Element(0).Object().Value("is_visible").Equal(true)
	response.Object().Value("payload").Array().Element(0).Object().Value("summary").Equal("Summary1")
	response.Object().Value("payload").Array().Element(0).Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Array().Element(0).Object().Value("image_url").Equal("https://exampleurl.com")
	response.Object().Value("payload").Array().Element(0).Object().Value("video_url").Equal("https://youtube.com")
	response.Object().Value("payload").Array().Element(0).Object().Value("tags").Array().Empty()

	response.Object().Value("payload").Array().Element(1).Object().Value("author_first_name").Equal("John")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_last_name").Equal("Adams")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_country").Equal("France")
	response.Object().Value("payload").Array().Element(1).Object().Value("ID").Equal(2)
	response.Object().Value("payload").Array().Element(1).Object().Value("content").Equal("Fiction")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")
	response.Object().Value("payload").Array().Element(1).Object().Value("year").Equal(2017)
	response.Object().Value("payload").Array().Element(0).Object().Value("is_visible").Equal(true)
	response.Object().Value("payload").Array().Element(1).Object().Value("summary").Equal("Summary2")
	response.Object().Value("payload").Array().Element(1).Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Array().Element(1).Object().Value("tags").Array().Empty()
}
func (suite *endpointTestSuite) TestGetAllInvisibleStories() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()

	//Add to sqlite db
	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)

	var response = suite.endpoint.GET("/stories").WithQuery("visibility", false).
		Expect().
		Status(http.StatusOK).JSON()

	response.Object().Value("payload").Array().Length().Equal(3)
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("Invisible Story")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Spiderman")
	response.Object().Value("payload").Array().Element(2).Object().Value("title").Equal("Casper The Ghost")

}

func (suite *endpointTestSuite) TestMixedUpQueryParams() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()

	//Add to sqlite db
	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)
	
	var response = suite.endpoint.GET("/stories").
		WithQuery("sort", "current_city").
		WithQuery("order", "asc").
		WithQuery("order", "desc").
		WithQuery("sort", "year").
		WithQuery("visibility", true).
		Expect().
		Status(http.StatusOK).JSON()
	
	response.Object().Value("payload").Array().Length().Equal(4)
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("Pulp Fiction")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")
	response.Object().Value("payload").Array().Element(2).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(3).Object().Value("title").Equal("Batman Begins")

}

func (suite *endpointTestSuite) TestSortByAuthor() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()

	//Add to sqlite db
	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)

	var response = suite.endpoint.GET("/stories").
		WithQuery("order", "desc").
		WithQuery("order", "asc").
		WithQuery("sort", "author_country").
		WithQuery("sort", "author_name").
		WithQuery("visibility", true).
		Expect().
		Status(http.StatusOK).JSON()

	response.Object().Value("payload").Array().Length().Equal(4)
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("Batman Begins")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")
	response.Object().Value("payload").Array().Element(2).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(3).Object().Value("title").Equal("Pulp Fiction")
}

func GetTagsToTest() []models.Tag {
	json := []models.Tag{
		{
			Name:    "EDUCATION",
			StoryID: 1,
		},
		{
			Name:    "REFUGEE",
			StoryID: 2,
		},
		{
			Name:    "EDUCATION",
			StoryID: 2,
		},
		{
			Name:    "REFUGEE",
			StoryID: 4,
		},
		{
			Name:    "EDUCATION",
			StoryID: 4,
		},
		{
			Name:    "IMMIGRATION",
			StoryID: 4,
		},
		{
			Name:    "EDUCATION",
			StoryID: 5,
		},
		{
			Name:    "REFUGEE",
			StoryID: 6,
		},
		{
			Name:    "EDUCATION",
			StoryID: 6,
		},
		{
			Name:    "REFUGEE",
			StoryID: 7,
		},
		{
			Name:    "EDUCATION",
			StoryID: 7,
		},
		{
			Name:    "IMMIGRATION",
			StoryID: 7,
		},
	}

	return json
}

func (suite *endpointTestSuite) TestGetVisibleStoriesWithTags() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()
	jsonTags := GetTagsToTest()

	//Add to sqlite db
	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)
	suite.db.Create(&jsonTags)
	var response = suite.endpoint.GET("/stories").
		WithQuery("tags", "EDUCATION").
		WithQuery("tags", "REFUGEE").
		WithQuery("tags", "IMMIGRATION").
		Expect().
		Status(http.StatusOK).JSON()

	//make sure that there are no duplicated values in return JSON:
	response.Object().Value("payload").Array().Length().Equal(3)

	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")
	response.Object().Value("payload").Array().Element(2).Object().Value("title").Equal("Pulp Fiction")
}

func (suite *endpointTestSuite) TestTagsWithSort() {

	jsonStories := GetStoriesToTest()
	jsonAuthors := GetAuthorsToTest()
	jsonTags := GetTagsToTest()

	//Add to sqlite db
	suite.db.Create(&jsonAuthors)
	suite.db.Create(&jsonStories)
	suite.db.Create(&jsonTags)

	//orderd query parameters randomly to make sure endpoint is robust
	var response = suite.endpoint.GET("/stories").
		WithQuery("order", "asc").
		WithQuery("tags", "REFUGEE").
		WithQuery("visibility", false).
		WithQuery("sort", "year").
		WithQuery("tags", "IMMIGRATION").
		Expect().
		Status(http.StatusOK).JSON()

	response.Object().Value("payload").Array().Length().Equal(2)
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("Casper The Ghost")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Spiderman")
}

func (suite *endpointTestSuite) TestVisibleStories() {
	json := []models.Author{
		{
			FirstName:     "Antoine",
			LastName:      "dSE",
			OriginCountry: "France",
			Bio:           "bio",
		},
		{
			FirstName:     "Douglas",
			LastName:      "Adams",
			OriginCountry: "UK",
			Bio:           "bio",
		},
	}

	token, _ := testutils.ValidToken()

	suite.endpoint.POST("/authors").WithHeader("Authorization", fmt.Sprintf("Bearer %s", token)).
		WithJSON(json).
		Expect().
		Status(http.StatusOK)

	invisibleStory := []models.Story{
		{
			Title:           "The Little Prince",
			Content:         "Children",
			Year:            2012,
			IsVisible:       false,
			Summary:         "Summary1",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			VideoURL:        "https://youtube.com",
			AuthorFirstName: "Antoine",
			AuthorLastName:  "dSE",
			AuthorCountry:   "France",
		},
	}
	visibleStory := []models.Story{
		{
			Title:           "Hitchhiker's Guide to the Galaxy",
			Content:         "Fiction",
			Year:            2012,
			IsVisible:       true,
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Douglas",
			AuthorLastName:  "Adams",
			AuthorCountry:   "UK",
		},
	}

	suite.db.Create(&invisibleStory)
	suite.db.Create(&visibleStory)

	var response = suite.endpoint.GET("/stories").
		Expect().
		Status(http.StatusOK).JSON()

	response.Object().Value("payload").Array().Length().Equal(1)
}

func (suite *endpointTestSuite) TestCreateAuthor() {
	json := []models.Author{
		{
			FirstName:     "Edmund",
			LastName:      "Pevensie",
			OriginCountry: "Nigeria",
			Bio:           "bio",
		},
	}

	token, _ := testutils.ValidToken()

	suite.endpoint.POST("/authors").
		WithHeader("Authorization", fmt.Sprintf("BEARER %s", token)).
		WithJSON(json).
		Expect().
		Status(http.StatusOK)

	var authorCount int64
	suite.db.Table("authors").Count(&authorCount)
	suite.Equal(1, int(authorCount))
}

func (suite *endpointTestSuite) TestCreateAuthorFailsWithUnknownCountry() {
	json := []models.Author{
		{
			FirstName:     "Edmund",
			LastName:      "Pevensie",
			OriginCountry: "Narnia",
			Bio:           "bio",
		},
	}

	token, _ := testutils.ValidToken()

	response := suite.endpoint.POST("/authors").
		WithHeader("Authorization", fmt.Sprintf("BEARER %s", token)).
		WithJSON(json).
		Expect().
		Status(http.StatusBadRequest).JSON()

	response.Object().Value("error").Equal("Unknown origin country")
}

func (suite *endpointTestSuite) TestCreateStory() {
	json := []models.Story{
		{
			Title:           "Jane Eyre",
			Content:         "Classic",
			Year:            2019,
			Summary:         "Summary",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			VideoURL:        "https://youtube.com",
			AuthorFirstName: "Charlotte",
			AuthorLastName:  "Bronte",
			AuthorCountry:   "UK",
		},
	}

	token, _ := testutils.ValidToken()

	suite.endpoint.POST("/stories").
		WithHeader("Authorization", fmt.Sprintf("BEARER %s", token)).
		WithJSON(json).
		Expect().
		Status(http.StatusOK)

	var storyCount int64
	suite.db.Table("stories").Count(&storyCount)
	suite.Equal(1, int(storyCount))
}

func (suite *endpointTestSuite) TestGetStoryByID() {
	json := []models.Story{
		{
			Title:           "Half of a Yellow Sun",
			Content:         "Fiction",
			Year:            2019,
			IsVisible:       true,
			Summary:         "Summary1",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			VideoURL:        "https://youtube.com",
			AuthorFirstName: "Chimamanda",
			AuthorLastName:  "Ngozi Adieche",
			AuthorCountry:   "Nigeria",
		},
	}

	suite.db.Create(&json)

	var response = suite.endpoint.GET("/story/1").
		Expect().
		Status(http.StatusOK).JSON()
	mock := `{
				"payload": [
				{
					"author_country": "Nigeria",
					"author_first_name": "Chimamanda",
					"author_last_name": "Ngozi Adieche",
					"current_city": "Toronto",
					"content": "Fiction",
					"year": 2019,
					"is_visible": true,
					"summary": "Summary1",
					"title": "Half of a Yellow Sun",
					"image_url":"https://exampleurl.com",
					"video_url":"https://youtube.com"
				}],
				"status": "OK"
			}`
	//Verify they are the same
	response.Schema(mock)
	response.Object().Value("payload").Object().Value("author_first_name").Equal("Chimamanda")
	response.Object().Value("payload").Object().Value("author_last_name").Equal("Ngozi Adieche")
	response.Object().Value("payload").Object().Value("author_country").Equal("Nigeria")
	response.Object().Value("payload").Object().Value("content").Equal("Fiction")
	response.Object().Value("payload").Object().Value("title").Equal("Half of a Yellow Sun")
	response.Object().Value("payload").Object().Value("year").Equal(2019)
	response.Object().Value("payload").Object().Value("is_visible").Equal(true)
	response.Object().Value("payload").Object().Value("summary").Equal("Summary1")
	response.Object().Value("payload").Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Object().Value("image_url").Equal("https://exampleurl.com")
	response.Object().Value("payload").Object().Value("video_url").Equal("https://youtube.com")
}

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
