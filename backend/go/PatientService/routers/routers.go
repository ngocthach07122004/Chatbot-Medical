package routers

import (
	"PatientService/internal/initBean"

	"github.com/gin-gonic/gin"
)

func RouterConfig(router *gin.Engine, controllerCollection *initBean.ControllerCollection) {
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
