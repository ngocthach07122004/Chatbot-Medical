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
	router.Use(cors.Default())
	DB := config.DB
	initBean.InitControllerCollection(DB)
	Controller := initBean.ControllerCollect
	routers.RouterConfig(router, Controller)
	servicePort := ": " + os.Getenv("PATIENT_PORT")
	// Kafka message
	initBean.InitKafka()
	kafkaAttribute := initBean.KafkaAttributeValue
	go kafkaMessage.ConsumeHistoryChatTopic(DB, kafkaAttribute)
	router.Run(servicePort)
}
