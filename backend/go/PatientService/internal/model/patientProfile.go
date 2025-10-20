package model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PatientProfile struct {
	ID uint64 `gorm:"primaryKey" json:"id"`
	gorm.Model
	FullName           *string             `json:"fullName"`
	Address            *string             `json:"address"`
	Age                *uint               `json:"age"`
	Gender             *string             `json:"gender"`
	Weight             *string             `json:"weight"`
	Data               datatypes.JSON      `gorm:"type:jsonb" json:"data"`
	Pathologys         []Pathology         `json:"pathologys"`
	Diagnosiss         []Diagnosis         `json:"diagnosiss"`
	DocterPatientChats []DocterPatientChat `json:"docterPatientChat"`
}
