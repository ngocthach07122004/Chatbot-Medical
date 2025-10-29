package kafkaMessage

import (
	"PatientService/internal/dto"
	"PatientService/internal/initBean"
	"PatientService/internal/model"
	"encoding/json"
	"fmt"
	"log"

	"github.com/IBM/sarama"
	"gorm.io/gorm"
)

// var KafkaAttribute *initBean.KafkaAttribute

func ConsumeHistoryChatTopic(DB *gorm.DB, kafkaAttribute *initBean.KafkaAttribute) {
	consumer, err := sarama.NewConsumer([]string{kafkaAttribute.Broker}, nil)
	if err != nil {
		log.Fatal("Error creating consumer:", err)
	}
	defer consumer.Close()

	partitionConsumer, err := consumer.ConsumePartition(kafkaAttribute.Topic, 0, sarama.OffsetNewest)
	if err != nil {
		log.Fatal("Error consuming partition:", err)
	}
	defer partitionConsumer.Close()

	// log.Printf("Listening for messages on topic '%s'...\n", kafkaAttribute.Topic)

	for msg := range partitionConsumer.Messages() {
		var dto dto.DoctorPatientChatDTO
		if err := json.Unmarshal(msg.Value, &dto); err != nil {
			log.Printf("Failed to parse JSON: %v\n", err)
			continue
		}
		fmt.Println("DTO response", dto)
		// data.saveDoctorPatientMessage(&dto)
		historyChatId := uint64(dto.HistoryChatID)
		doctorPatientChat := model.DoctorPatientChat{
			PatientID:   uint64(dto.PatientID),
			HistoryChatID: &historyChatId,
			DoctorID:    uint64(dto.DoctorID),
		}
		DB.Model(&model.DoctorPatientChat{}).Save(doctorPatientChat)
	}
}
