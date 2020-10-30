package restapi

import (
	"fmt"
	"net/http"
	"github.com/spf13/viper"
	"net/http/httptest"
	"testing"
	"github.com/gavv/httpexpect/v2"
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
	token     string
}

func (suite *endpointTestSuite) SetupSuite() {
	db, err := testutils.CreateMemDatabase()
	if err != nil {
		suite.Fail("error while creating database", err)
	}
	suite.db = db

	router, err := Router(db)
	if err != nil {
		suite.FailNow("error while creating router", err)
	}

	server := httptest.NewServer(router)
	suite.endpoint = httpexpect.New(suite.T(), server.URL)

	// setup required for jwt authentication
	viper.SetDefault("auth.jwt_key", "GotFKl1PGgMpLg7D36NiI0hy/gsl6woTCXYdhKATbzc=")
	viper.SetDefault("auth.jwt_expiry", "2h")
	viper.SetDefault("auth.jwt_issuer", "endpoint_tests")
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
	suite.endpoint.GET("/stories").
		Expect().
		Status(http.StatusOK).
		Body().Equal( "{\"status\":\"OK\",\"payload\":[]}\n")
}

func (suite *endpointTestSuite) TestCreateAuthor() {
	json := []models.Author{
		{
			FirstName:     "d",
			LastName:      "d",
			OriginCountry: "India",
			CurrentCity:   "Toronto",
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

func (suite *endpointTestSuite) TestCreateStory(){
	json := []models.Story{
		{
			Title:      "Jane Eyre",
			Content:    "Classic",
			AuthorID:    1,
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

// func (suite *endpointTestSuite) TestGetStoryByID() {
// 	suite.endpoint.GET("/story/1").
// 		Expect().
// 		Status(http.StatusOK)
// }

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
