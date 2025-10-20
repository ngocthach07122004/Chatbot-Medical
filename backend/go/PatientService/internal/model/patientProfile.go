package model

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PatientProfile struct {
	ID                 uint64              `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt          time.Time           `json:"createdAt"`
	UpdatedAt          time.Time           `json:"updatedAt"`
	DeletedAt          gorm.DeletedAt      `gorm:"index" json:"deletedAt"`
	FullName           *string             `json:"fullName"`
	Address            *string             `json:"address"`
	Age                *uint               `json:"age"`
	Gender             *string             `json:"gender"`
	Weight             *string             `json:"weight"`
	Data               datatypes.JSON      `gorm:"type:jsonb" json:"data"`
	Pathologys         []Pathology         `json:"pathologys"`
	Diagnosiss         []Diagnosis         `json:"diagnosiss"`
	DoctorPatientChats []DoctorPatientChat `json:"DoctorPatientChat"`
}
