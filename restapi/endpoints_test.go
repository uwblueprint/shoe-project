package restapi

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"gorm.io/driver/postgres"
	"github.com/gavv/httpexpect/v2"
	"gorm.io/gorm"
	"github.com/DATA-DOG/go-sqlmock"

)
func TestHealthCheck (t *testing.T){
	//Declare new sql mock db
	db, _, err := sqlmock.New()
   
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	//Open postgres connection with gorm db
	gdb, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	  }), &gorm.Config{})

	if err != nil {
		t.Errorf("Error opening db")
	}	

	//Define handler, pass in mock gorm db
	handler,_ := Router(gdb)
	server := httptest.NewServer(handler)
	e := httpexpect.New(t, server.URL)

	//Send request for health endpoint
	e.GET("/health").
			Expect().
			Status(http.StatusOK).Body().Equal("{\"message\":\"Hello World\"}\n")

}

func TestGetAllStories(t *testing.T) {
	db, mock, err := sqlmock.New()
   
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()
	gdb, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	  }), &gorm.Config{})

	if err != nil {
		t.Errorf("Error opening db")
	}	
	var arr []string
	mock.ExpectBegin()
    mock.ExpectQuery("SELECT * FROM stories WHERE stories.deleted_at IS NULL").WillReturnRows(sqlmock.NewRows(arr))
	mock.ExpectCommit()


	handler,_ := Router(gdb)
	server := httptest.NewServer(handler)
	e := httpexpect.New(t, server.URL)
	e.GET("/stories").
			Expect().
			Status(http.StatusOK).JSON().Array().Empty()

}

func TestGetStoryByID(t *testing.T) {

}
func TestCreateAuthor(t *testing.T) {

}

