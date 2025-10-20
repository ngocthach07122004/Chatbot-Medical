package initBean

import (
	"PatientService/internal/repository"

	"gorm.io/gorm"
)

var ControllerCollect *ControllerCollection

type ControllerCollection struct {
	PatientRepo *repository.PatientProfileRepo
}

func InitControllerCollection(db *gorm.DB) {
	ControllerCollect = &ControllerCollection{
		PatientRepo: &repository.PatientProfileRepo{
			DB: db,
		},
	}
}
