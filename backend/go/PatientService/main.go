package main

import (
	"PatientService/config"
	"PatientService/internal/initBean"
	"PatientService/internal/kafkaMessage"
	"PatientService/routers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	router := gin.Default()
	// router.Use(cors.Default())
	router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:5173"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
}))

	DB := config.DB
	initBean.InitControllerCollection(DB)
	Controller := initBean.ControllerCollect
	routers.RouterConfig(router, Controller)
	servicePort := ":" + os.Getenv("PATIENT_PORT")
	// Kafka message
	initBean.InitKafka()
	kafkaAttribute := initBean.KafkaAttributeValue
	go kafkaMessage.ConsumeHistoryChatTopic(DB, kafkaAttribute)
	router.Run(servicePort)
}
