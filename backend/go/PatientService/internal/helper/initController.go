package helper

import (
	"PatientService/internal/repository"

	"gorm.io/gorm"
)

var controllerCollection *ControllerCollection

type ControllerCollection struct {
	PatientRepo *repository.PatientProfileRepo
}

func InitControllerCollection(db *gorm.DB) {
	controllerCollection = &ControllerCollection{
		PatientRepo: &repository.PatientProfileRepo{
			DB: db,
		},
	}
}
