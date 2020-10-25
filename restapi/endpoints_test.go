package restapi

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/stretchr/testify/suite"
	"github.com/uwblueprint/shoe-project/internal/database/migrations"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/testutils"
	"gorm.io/gorm"
)

var TOKEN string

type endpointTestSuite struct {
	suite.Suite
	endpoint *httpexpect.Expect
	db       *gorm.DB
}

func (suite *endpointTestSuite) SetupSuite() {
	db, err := testutils.MockDatabase()
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
		Status(http.StatusOK).
		Body().Equal("{\"message\":\"Hello World\"}\n")
}

func (suite *endpointTestSuite) TestGetAllStories() {
	suite.endpoint.GET("/stories").
		Expect().
		Status(http.StatusOK).
		Body().Equal( "{\"status\":\"OK\",\"payload\":[]}\n"	)
}


func (suite *endpointTestSuite) TestLogin() {

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

	suite.endpoint.POST("/authors").
		WithJSON(json).
		Expect().
		Status(http.StatusOK)

	var authorCount int64
	suite.db.Table("authors").Count(&authorCount)
	suite.Equal(1, int(authorCount))
}

func (suite *endpointTestSuite) TestCreateStory(){

}

func (suite *endpointTestSuite) TestGetStoryByID() {
	suite.endpoint.GET("/story/1").
		Expect().
		Status(http.StatusOK).
		Body().Equal( "{\"status\":\"OK\",\"payload\":[]}\n"	)
}

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
