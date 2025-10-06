package model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Diagnosis struct {
	gorm.Model
	Data datatypes.JSON `gorm:"type:jsonb"`
}
