package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
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
	fmt.Println("Connect Database successful")
}
