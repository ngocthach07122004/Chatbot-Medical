package repository

import (
	"PatientService/internal/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DoctorPatientChatRepo struct {
	DB *gorm.DB
}

// func (data *DoctorPatientChatRepo) HandleSaveDoctorPatientMessage(c *gin.Context) {
// 	initBean.InitKafka()
// 	kafkaAttribute := initBean.KafkaConfig
// 	go data.consumeKafka(kafkaAttribute)
// }

// func (data *DoctorPatientChatRepo) consumeKafka(kafkaAttribute *initBean.KafkaAttribute) {
// 	consumer, err := sarama.NewConsumer([]string{kafkaAttribute.Broker}, nil)
// 	if err != nil {
// 		log.Fatal("Error creating consumer:", err)
// 	}
// 	defer consumer.Close()

// 	partitionConsumer, err := consumer.ConsumePartition(kafkaAttribute.Topic, 0, sarama.OffsetNewest)
// 	if err != nil {
// 		log.Fatal("Error consuming partition:", err)
// 	}
// 	defer partitionConsumer.Close()

// 	// log.Printf("Listening for messages on topic '%s'...\n", kafkaAttribute.Topic)

// 	for msg := range partitionConsumer.Messages() {
// 		var dto dto.DoctorPatientChatDTO
// 		if err := json.Unmarshal(msg.Value, &dto); err != nil {
// 			log.Printf("Failed to parse JSON: %v\n", err)
// 			continue
// 		}
// 		fmt.Println("DTO response", dto)
// 		// data.saveDoctorPatientMessage(&dto)
// 		historyChatId := uint64(dto.HistoryChatID)
// 		doctorPatientChat := model.DoctorPatientChat{
// 			PatientId:   uint64(dto.PatientID),
// 			HistoryChat: &historyChatId,
// 			DoctorId:    uint64(dto.DoctorID),
// 		}
// 		data.DB.Model(&model.DoctorPatientChat{}).Save(doctorPatientChat)
// 	}
// }

//	func (data *DoctorPatientChatRepo) saveDoctorPatientMessage(doctorPatientDTO *dto.DoctorPatientChatDTO) {
//			data.DB.
//	}
func (data *DoctorPatientChatRepo) GetAllDoctorPatientMessage(c *gin.Context) {
	var doctorPatientMess []model.DoctorPatientChat
	data.DB.Model(&model.DoctorPatientChat{}).Find(&doctorPatientMess)
	c.JSON(http.StatusOK, gin.H{"data": doctorPatientMess})

}
