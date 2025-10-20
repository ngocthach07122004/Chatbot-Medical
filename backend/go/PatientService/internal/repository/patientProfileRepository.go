package repository

import (
	"PatientService/internal/helper"
	"PatientService/internal/model"
	"errors"
	"net/http"
	"strconv"

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

func findPatient(patientId uint64, patient *PatientProfileRepo) helper.Result[model.PatientProfile] {
	var patientProfile model.PatientProfile
	if err := patient.DB.Preload("Pathologys").Preload("Diagnosiss").First(&patientProfile, patientId).Error; err != nil {
		return helper.Result[model.PatientProfile]{Err: errors.New("Patient not found")}
	}
	return helper.Result[model.PatientProfile]{Value: patientProfile, Err: nil}

}

func (patient *PatientProfileRepo) GetPatientById(c *gin.Context) {
	var patientProfile model.PatientProfile
	patientIdParam := c.Param("patientId")
	patientId, err := strconv.ParseUint(patientIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patientId"})
		return
	}
	if result := findPatient(patientId, patient); result.Err != nil {
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
	patientIdParam := c.Param("patientId")
	patientId, err := strconv.ParseUint(patientIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid patientId"})
		return
	}
	result := findPatient(patientId, patient)
	if result.Err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Err.Error()})
		return
	}
	patientProfile = result.Value
	patient.DB.Create(pathology)
	patient.DB.Model(&patientProfile).Association("Pathologys").Append(&pathology)
	c.JSON(http.StatusOK, gin.H{"data": patientProfile})

}

func (patient *PatientProfileRepo) FindPatientsByDoctor(c *gin.Context) {
	doctorIdParam := c.Param("doctorId")
	doctorId, err := strconv.ParseUint(doctorIdParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid doctorId"})
		return
	}
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit := 12
	offset := (page - 1) * limit
	var patients []model.PatientProfile
	var total int64
	patient.DB.Model(&model.PatientProfile{}).
		Joins("JOIN doctor_patient_chats dpc ON dpc.patient_id = patient_profiles.id").
		Where("dpc.doctor_id = ?", doctorId).
		Count(&total)

	errorQuery := patient.DB.
		Joins("JOIN doctor_patient_chats dpc ON dpc.patient_id = patient_profiles.id").
		Where("dpc.doctor_id = ?", doctorId).
		Preload("Pathologys").
		Preload("Diagnosiss").
		Offset(offset).
		Limit(limit).
		Find(&patients).Error
	if errorQuery != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": errorQuery.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data":       patients,
		"page":       page,
		"limit":      limit,
		"total":      total,
		"totalPages": (total + int64(limit) - 1) / int64(limit),
	})

}
