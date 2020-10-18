package restapi

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
	// "github.com/uwblueprint/shoe-project/restapi/stories"
	// "github.com/uwblueprint/shoe-project/restapi/api"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"github.com/gorilla/mux"
	"github.com/go-resty/resty/v2"
)
// func executeRequest(req *http.Request, funcName string) *httptest.ResponseRecorder {
	
// 	r := server.CreateRouter()		
// 	rr:= httptest.NewRecorder()
// 	r.Router.ServeHTTP(rr, req) 
	
// 		return rr
// 	}
	
// func checkResponseCode(t *testing.T, expected, actual int) {
// 		if expected != actual {
// 			t.Errorf("Expected response code %d. Got %d\n", expected, actual)
// 		}
// }

func TestGetAllStories(t *testing.T) {
	r := server.CreateRouter()

//	Create new request to /stories endpoint
	req, err := http.NewRequest("GET", "/stories", nil)
	if err != nil {
		t.Fatal(err)
	}

	//Execute the request and have recorder record the response from /stories endpoint
	rr := httptest.NewRecorder()	
 	handler := http.HandlerFunc(ReturnAllStories)
	handler.ServeHTTP(rr, req)

	//Check if response code is as expected
	if status := rr.Code; status !=http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	//Check if expected output
    expected := `[{"status":"OK","payload":[{"ID":1,"CreatedAt":"2020-10-18T18:22:36.2202Z","UpdatedAt":"2020-10-18T18:22:36.2202Z","DeletedAt":{"Time":"0001-01-01T00:00:00Z","Valid":false},"Title":"bandwidth","Content":"We need to transmit the auxiliary GB application!","AuthorID":1,"Author":{"ID":0,"CreatedAt":"0001-01-01T00:00:00Z","UpdatedAt":"0001-01-01T00:00:00Z","DeletedAt":{"Time":"0001-01-01T00:00:00Z","Valid":false},"FirstName":"","LastName":"","Bio":"","OriginCountry":"","CurrentCity":"","Stories":null}},{"ID":2,"CreatedAt":"2020-10-18T18:34:26.573069Z","UpdatedAt":"2020-10-18T18:34:26.573069Z","DeletedAt":{"Time":"0001-01-01T00:00:00Z","Valid":false},"Title":"application","Content":"If we synthesize the protocol, we can get to the AGP alarm through the solid state RAM application!","AuthorID":2,"Author":{"ID":0,"CreatedAt":"0001-01-01T00:00:00Z","UpdatedAt":"0001-01-01T00:00:00Z","DeletedAt":{"Time":"0001-01-01T00:00:00Z","Valid":false},"FirstName":"","LastName":"","Bio":"","OriginCountry":"","CurrentCity":"","Stories":null}}]}
	]`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}

	// client := resty.New();
	// resp, _ := client.R().Get("http://127.0.0.1:8900/api/stories")

	// if resp.StatusCode() != 200 {
	// 	t.Errorf("Unexpected status code, expected %d, got %d instead", 200, resp.StatusCode())
	// }
}

func TestGetStoryByID(t *testing.T) {

}
func TestCreateAuthor(t *testing.T) {

}

