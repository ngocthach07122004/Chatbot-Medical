package model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Diagnosis struct {
	ID uint64 `gorm:"primaryKey" json:"id"`
	gorm.Model
	Data      datatypes.JSON  `gorm:"type:jsonb" json:"data"`
	PatientId uint64          `json:"patientId"`
	Patient   *PatientProfile `gorm:"foreignKey:PatientId,references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"patient"`
}
