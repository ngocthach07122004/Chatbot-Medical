package com.vn.Medical;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicalApplication {

	public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load(); // load .env ở project root
        System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
        System.setProperty("DB_PORT", dotenv.get("POSTGRES_PORT"));
        System.setProperty("DB_NAME", dotenv.get("POSTGRES_DB"));
        System.setProperty("DB_USER", dotenv.get("POSTGRES_USER"));
        System.setProperty("DB_PASSWORD", dotenv.get("POSTGRES_PASSWORD"));
		SpringApplication.run(MedicalApplication.class, args);
	}

}
