package initBean

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type KafkaAttribute struct {
	Broker string
	Topic  string
}

var KafkaAttributeValue *KafkaAttribute

func InitKafka() {
	err := godotenv.Load("../../../.env")
	if err != nil {
		log.Println("Can 't find file .env", err)
	}
	KafkaAttributeValue = &KafkaAttribute{
		Broker: os.Getenv("BROKER"),
		Topic:  os.Getenv("TOPIC"),
	}
}
