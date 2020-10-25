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

func (suite *endpointTestSuite) TestCreateAuthor() {
	json := []models.Author{
		{
			FirstName:     "d",
			LastName:      "d",
			OriginCountry: "India",
			CurrentCity:   "Toronto",
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

func (suite *endpointTestSuite) TestHealthCheck() {
	suite.endpoint.GET("/health").
		Expect().
		Status(http.StatusOK).
		Body().Equal("{\"message\":\"Hello World\"}\n")
}

func (suite *endpointTestSuite) TestGetAllStories() {
	// TODO implement

	//var arr []string
	//mock.ExpectBegin()
	//mock.ExpectQuery("SELECT * FROM stories WHERE stories.deleted_at IS NULL").WillReturnRows(sqlmock.NewRows(arr))
	//mock.ExpectCommit()

	//handler,_ := Router(gdb)
	//server := httptest.NewServer(handler)
	//e := httpexpect.New(t, server.URL)
	//e.GET("/stories").
	//Expect().
	//Status(http.StatusOK).JSON().Array().Empty()
}

func (suite *endpointTestSuite) TestGetStoryByID() {
	// TODO implement
}

func (suite *endpointTestSuite) TearDownSuite() {
	if err := testutils.CloseDatabase(suite.db); err != nil {
		suite.Fail("error while closing database", err)
	}
}

func TestEndpointTestSuite(t *testing.T) {
	suite.Run(t, new(endpointTestSuite))
}
