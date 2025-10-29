package config

import (
	"PatientService/internal/model"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load("../../../.env")
	if err != nil {
		log.Println("Can 't find file .env", err)
	}
	host := os.Getenv("DB_HOST_PATIENT")
	port := os.Getenv("POSTGRES_PORT_PATIENT")
	user := os.Getenv("POSTGRES_USER_PATIENT")
	password := os.Getenv("POSTGRES_PASSWORD_PATIENT")
	dbname := os.Getenv("POSTGRES_DB_PATIENT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		host, user, password, dbname, port)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Can't connect database:", err)
		os.Exit(1)
	}

	DB = database
	DB.AutoMigrate(&model.Diagnosis{})
	DB.AutoMigrate(&model.DoctorPatientChat{})
	DB.AutoMigrate(&model.Pathology{})
	DB.AutoMigrate(&model.PatientProfile{})
	fmt.Println("Connect Database successful")
}
