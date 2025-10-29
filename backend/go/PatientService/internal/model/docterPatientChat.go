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
	PatientID   uint64         `json:"patientId"`
	HistoryChatID *uint64      `json:"historyChat"`
	DoctorID    uint64         `json:"DoctorId"`
}
