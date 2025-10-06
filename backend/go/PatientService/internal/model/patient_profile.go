package model

import "gorm.io/gorm"

type PatientProfile struct {
	gorm.Model
	FullName string `json:"fullName"`
	Address  string `json:"address"`
	Age      uint   `json:"age"`
}
