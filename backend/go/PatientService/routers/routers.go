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
		patientRouter.POST("/create/:doctorId", controllerCollection.PatientRepo.CreatePatient)
		patientRouter.GET("/:patientId", controllerCollection.PatientRepo.GetPatientById)
		patientRouter.GET("/doctor/:doctorId", controllerCollection.PatientRepo.FindPatientsByDoctor)
		patientRouter.POST("/update/:patientId", controllerCollection.PatientRepo.UpdatePatient)
		patientRouter.DELETE("/delete/:patientId", controllerCollection.PatientRepo.DeletePatient)
		patientRouter.GET("/doctor/lightweight/:doctorId",controllerCollection.PatientRepo.GetListPatient)
	}
	{
		pathology.POST("/create/:patientId", controllerCollection.PatientRepo.CreatePathology)
	}
	{
		chatHistory.GET("/all", controllerCollection.DoctorPatientChatRepo.GetAllDoctorPatientMessage)
	}
}
