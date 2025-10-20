package com.vn.Medical.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Component
public class PreInitDatabase {

    @PostConstruct
    public void ensureDatabaseExists() {
        String host = System.getenv("DB_HOST");
        String port = System.getenv("DB_PORT");
        String dbName = System.getenv("DB_NAME");
        String user = System.getenv("DB_USER");
        String pass = System.getenv("DB_PASSWORD");

        String defaultUrl = String.format("jdbc:postgresql://%s:%s/postgres", host, port);

        try (Connection conn = DriverManager.getConnection(defaultUrl, user, pass);
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE " + dbName);
            System.out.println("✅ Database created: " + dbName);
        } catch (SQLException e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("ℹ️ Database already exists: " + dbName);
            } else {
                System.err.println("❌ Failed to create database: " + e.getMessage());
            }
        }
    }
}
