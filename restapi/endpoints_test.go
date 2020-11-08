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
		WithJSON([]models.User{{
			Username: "admin",
			Password: "root",
		}}).
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

func (suite *endpointTestSuite) TestGetAllStories() {
	json_story1 := []models.Story{
		{
			Title:    "The Little Prince",
			Content:  "Children",
			AuthorID: 1,
		},
	}

	json_story2 := []models.Story{
		{
			Title:    "Hitchhiker's Guide to the Galaxy",
			Content:  "Fiction",
			AuthorID: 2,
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
			"author_id": 1,
			"content": "Children",
			"title": "The Little Prince"
		},
		{
			"author_id": 2,
			"content": "Fiction",
			"title": "Hitchhiker's Guide to the Galaxy"
		}
		],
		"status": "OK"
	}`

	//Verify response matches
	response.Schema(mock)

	response.Object().Value("payload").Array().Element(0).Object().Value("ID").Equal(1)
	response.Object().Value("payload").Array().Element(0).Object().Value("content").Equal("Children")
	response.Object().Value("payload").Array().Element(0).Object().Value("title").Equal("The Little Prince")
	response.Object().Value("payload").Array().Element(1).Object().Value("ID").Equal(2)
	response.Object().Value("payload").Array().Element(1).Object().Value("content").Equal("Fiction")
	response.Object().Value("payload").Array().Element(1).Object().Value("title").Equal("Hitchhiker's Guide to the Galaxy")

}

func (suite *endpointTestSuite) TestCreateAuthor() {
	json := []models.Author{
		{
			FirstName:     "Edmund",
			LastName:      "Pevensie",
			OriginCountry: "Narnia",
			CurrentCity:   "London",
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

func (suite *endpointTestSuite) TestCreateStory() {
	json := []models.Story{
		{
			Title:    "Jane Eyre",
			Content:  "Classic",
			AuthorID: 2,
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
			Title:    "Swan Lake for Beginners",
			Content:  "Short Story",
			AuthorID: 1,
		},
	}

	suite.db.Create(&json)

	var response = suite.endpoint.GET("/story/1").
		Expect().
		Status(http.StatusOK).JSON()
	mock := `{
				"payload": [
				{
					"author_id": 1,
					"content": "Short Story",
					"title": "Swan Lake for Beginners"
				}],
				"status": "OK"
			}`
	//Verify they are the same
	response.Schema(mock)
	response.Object().Value("payload").Object().Value("ID").Equal(1)
	response.Object().Value("payload").Object().Value("content").Equal("Short Story")
	response.Object().Value("payload").Object().Value("title").Equal("Swan Lake for Beginners")

}

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
