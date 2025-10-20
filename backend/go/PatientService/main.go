package main

import (
	"PatientService/config"
	"PatientService/internal/initBean"
	"PatientService/routers"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	router := gin.Default()
	DB := config.DB
	initBean.InitControllerCollection(DB)
	Controller := initBean.ControllerCollect
	routers.RouterConfig(router, Controller)
	servicePort := ": " + os.Getenv("PATIENT_PORT")
	router.Run(servicePort)
}
