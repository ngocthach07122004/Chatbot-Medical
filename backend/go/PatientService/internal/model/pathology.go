package model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Pathology struct {
	ID uint `gorm:"primaryKey" json:"id"`
	gorm.Model
	Data      datatypes.JSON  `gorm:"type:jsonb" json:"data"`
	DocterId  string          `json:"docterId"`
	PatientId uint            `json:"patientId"`
	Patient   *PatientProfile `gorm:"foreignKey:PatientId,references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"patient"`
}
