package router

import (
	"PatientService/internal/helper"

	"github.com/gin-gonic/gin"
)

func RouterConfig(router *gin.Engine, controllerCollection *helper.ControllerCollection) {
	patientRouter := router.Group("/patient")
	pathology := router.Group("/pathology")
	{
		patientRouter.POST("/create", controllerCollection.PatientRepo.CreatePatient)
		patientRouter.GET("/:id", controllerCollection.PatientRepo.GetPatientById)
	}
	{
		pathology.POST("/create", controllerCollection.PatientRepo.CreatePathology)
	}
}
