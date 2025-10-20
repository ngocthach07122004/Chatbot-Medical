package routers

import (
	"PatientService/internal/initBean"

	"github.com/gin-gonic/gin"
)

func RouterConfig(router *gin.Engine, controllerCollection *initBean.ControllerCollection) {
	patientRouter := router.Group("/patient")
	pathology := router.Group("/pathology")
	chatHistory := router.Group("/chatHistory")
	{
		patientRouter.POST("/create", controllerCollection.PatientRepo.CreatePatient)
		patientRouter.GET("/:id", controllerCollection.PatientRepo.GetPatientById)
		patientRouter.GET("/doctor/:doctorId", controllerCollection.PatientRepo.FindPatientsByDoctor)
	}
	{
		pathology.POST("/create", controllerCollection.PatientRepo.CreatePathology)
	}
	{
		chatHistory.GET("/all", controllerCollection.DoctorPatientChatRepo.GetAllDoctorPatientMessage)
	}
}
