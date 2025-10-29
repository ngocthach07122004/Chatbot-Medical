package model

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Diagnosis struct {
	ID        uint64          `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt gorm.DeletedAt  `gorm:"index" json:"deletedAt"`
	Data      datatypes.JSON  `gorm:"type:jsonb" json:"data"`
	PatientID uint64          `json:"patientId"`
	// Patient   *PatientProfile `gorm:"foreignKey:PatientId,references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"patient"`
}
