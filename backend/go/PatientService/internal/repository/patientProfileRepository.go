package repository

import (
	"PatientService/internal/helper"
	"PatientService/internal/model"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PatientProfileRepo struct {
	DB *gorm.DB
}

func (patient *PatientProfileRepo) CreatePatient(c *gin.Context) {
	var patientProfile model.PatientProfile
	if err := c.ShouldBindJSON(&patientProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	patient.DB.Create(&patientProfile)
	c.JSON(http.StatusOK, gin.H{"data": patientProfile})
}

func findPatient(patientId string, patient *PatientProfileRepo) helper.Result[model.PatientProfile] {
	var patientProfile model.PatientProfile
	if err := patient.DB.Preload("Pathologys").Preload("Diagnosiss").First(&patientProfile, patientId).Error; err != nil {
		return helper.Result[model.PatientProfile]{Err: errors.New("Patient not found")}
	}
	return helper.Result[model.PatientProfile]{Value: patientProfile, Err: nil}

}

func (patient *PatientProfileRepo) GetPatientById(c *gin.Context) {
	var patientProfile model.PatientProfile
	if result := findPatient(c.Param("patientId"), patient); result.Err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": patientProfile})
}

func (patient *PatientProfileRepo) CreatePathology(c *gin.Context) {
	var patientProfile model.PatientProfile
	var pathology model.Pathology
	if err := c.ShouldBindJSON(&pathology); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := findPatient(c.Param("patientId"), patient)
	if result.Err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Err.Error()})
		return
	}
	patientProfile = result.Value
	patient.DB.Create(pathology)
	patient.DB.Model(&patientProfile).Association("Pathologys").Append(&pathology)
	c.JSON(http.StatusOK, gin.H{"data": patientProfile})

}
