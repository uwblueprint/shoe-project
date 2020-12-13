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
	token    string
}

func (suite *endpointTestSuite) SetupSuite() {
	db, err := testutils.CreateMemDatabase()
	if err != nil {
		suite.Fail("error while creating database", err)
	}
	suite.db = db

	// setup required for jwt authentication
	viper.SetDefault("auth.jwt_key", "random")
	viper.SetDefault("auth.jwt_expiry", "5m")
	viper.SetDefault("auth.jwt_issuer", "endpoint_tests")
	viper.SetDefault("auth.superuser_username", "admin")
	viper.SetDefault("auth.superuser_password", "root")

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
	if err := migrations.CreateSuperUser(suite.db); err != nil {
		suite.Fail("error creating super user", err)
	}

	suite.token = suite.endpoint.POST("/login").
		WithJSON(map[string]string{
			"username": "admin",
			"password": "root",
		}).
		Expect().
		Status(http.StatusOK).JSON().Object().Value("payload").String().Raw()
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

func (suite *endpointTestSuite) TestGetAllStories() {
	json_story1 := []models.Story{
		{
			Title:           "The Little Prince",
			Content:         "Children",
			Date:            "January 2012",
			Summary:         "Summary1",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Antoine",
			AuthorLastName:  "dSE",
			AuthorCountry:   "France",
		},
	}

	json_story2 := []models.Story{
		{
			Title:           "Hitchhiker's Guide to the Galaxy",
			Content:         "Fiction",
			Date:            "July 2012",
			Summary:         "Summary2",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Douglas",
			AuthorLastName:  "Adams",
			AuthorCountry:   "UK",
		},
	}

	//Add to sqlite db
	suite.db.Create(&json_story1)
	suite.db.Create(&json_story2)

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
			"date": "January 2012",
			"summary": "Summary1",
			"current_city": "Toronto",
			"image_url" : "https://exampleurl.com"
		},
		{
			"author_first_name": "Douglas",
			"author_last_name": "Adams",
			"author_country": "UK",
			"content": "Fiction",
			"title": "Hitchhiker's Guide to the Galaxy",
			"date": "July 2012",
			"summary": "Summary2",
			"current_city": "Toronto",
			"image_url" : "https://exampleurl.com"
		}
		],
		"status": "OK"
	}`

	//Verify response matches
	response.Schema(mock)

	response.Object().Value("payload").Array().Element(0).Object().Value("author_first_name").Equal("Antoine")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_last_name").Equal("dSE")
	response.Object().Value("payload").Array().Element(0).Object().Value("author_country").Equal("France")
	response.Object().Value("payload").Array().Element(0).Object().Value("ID").Equal(1)
	response.Object().Value("payload").Array().Element(0).Object().Value("content").Equal("Children")
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(0).Object().Value("date").Equal("January 2012")
	response.Object().Value("payload").Array().Element(0).Object().Value("summary").Equal("Summary1")
	response.Object().Value("payload").Array().Element(0).Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Array().Element(0).Object().Value("image_url").Equal("https://exampleurl.com")

	response.Object().Value("payload").Array().Element(1).Object().Value("author_first_name").Equal("Douglas")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_last_name").Equal("Adams")
	response.Object().Value("payload").Array().Element(1).Object().Value("author_country").Equal("UK")
	response.Object().Value("payload").Array().Element(1).Object().Value("ID").Equal(2)
	response.Object().Value("payload").Array().Element(1).Object().Value("content").Equal("Fiction")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")
	response.Object().Value("payload").Array().Element(1).Object().Value("date").Equal("July 2012")
	response.Object().Value("payload").Array().Element(1).Object().Value("summary").Equal("Summary2")
	response.Object().Value("payload").Array().Element(1).Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Array().Element(0).Object().Value("image_url").Equal("https://exampleurl.com")
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

	suite.endpoint.POST("/authors").WithHeader("Authorization", fmt.Sprintf("Bearer %s", suite.token)).
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

	response := suite.endpoint.POST("/authors").WithHeader("Authorization", fmt.Sprintf("Bearer %s", suite.token)).
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
			Date:            "2019",
			Summary:         "Summary",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
			AuthorFirstName: "Charlotte",
			AuthorLastName:  "Bronte",
			AuthorCountry:   "UK",
		},
	}

	suite.endpoint.POST("/stories").WithHeader("Authorization", "Bearer "+suite.token).
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
			Date:            "2019",
			Summary:         "Summary1",
			CurrentCity:     "Toronto",
			ImageURL:        "https://exampleurl.com",
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
					"date": "2019",
					"summary": "Summary1",
					"title": "Half of a Yellow Sun",
					"image_url":"https://exampleurl.com"
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
	response.Object().Value("payload").Object().Value("date").Equal("2019")
	response.Object().Value("payload").Object().Value("summary").Equal("Summary1")
	response.Object().Value("payload").Object().Value("current_city").Equal("Toronto")
	response.Object().Value("payload").Object().Value("image_url").Equal("https://exampleurl.com")
}

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
