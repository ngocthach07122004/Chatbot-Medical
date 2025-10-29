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
	Age                *string               `json:"age"`
	Gender             *string             `json:"gender"`
	Weight             *string             `json:"weight"`
	Data               datatypes.JSON      `gorm:"type:jsonb" json:"data"`
	Pathologys         []Pathology         `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"pathologys"`
	Diagnosiss         []Diagnosis         `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"diagnosiss"`
	DoctorPatientChats []DoctorPatientChat `gorm:"foreignKey:PatientID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"doctorPatientChat"`
}

