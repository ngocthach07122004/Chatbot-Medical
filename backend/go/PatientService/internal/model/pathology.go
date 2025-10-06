package model

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Pathology struct {
	gorm.Model
	Data datatypes.JSON `gorm:"type:jsonb"`
}
