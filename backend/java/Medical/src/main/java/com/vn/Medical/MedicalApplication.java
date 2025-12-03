package com.vn.Medical;

import com.vn.Medical.config.DatabaseCreator;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class MedicalApplication {

	public static void main(String[] args) {

            TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        Dotenv dotenv = Dotenv.load(); // load .env ở project root
        System.setProperty("DOCTOR_SERVICE_PORT", dotenv.get("DOCTOR_PORT"));
        System.setProperty("DB_HOST", dotenv.get("DB_HOST_DOCTOR"));
        System.setProperty("DB_PORT", dotenv.get("POSTGRES_PORT_DOCTOR"));
        System.setProperty("DB_NAME", dotenv.get("POSTGRES_DB_DOCTOR"));
        System.setProperty("DB_USER", dotenv.get("POSTGRES_USER_DOCTOR"));
        System.setProperty("DB_PASSWORD", dotenv.get("POSTGRES_PASSWORD_DOCTOR"));
        SpringApplication application = new SpringApplication(MedicalApplication.class);
        application.addInitializers(new DatabaseCreator()); // ✅ chạy trước Hibernate
        application.run(args);
//		SpringApplication.run(MedicalApplication.class, args);
	}

}
