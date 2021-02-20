package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) ReturnAllUniqueTags(w http.ResponseWriter, r *http.Request) render.Renderer {
	var tags []models.Tag

	err := api.database.Distinct("name").Find(&tags).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(tags)
}
