package model

import (
	"time"

	"gorm.io/gorm"
)

type DoctorPatientChat struct {
	ID          uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	PatientId   uint64         `json:"patientId"`
	HistoryChat *uint64        `json:"historyChat"`
	DoctorId    uint64         `json:"DoctorId"`
}
