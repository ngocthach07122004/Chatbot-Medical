package com.vn.Medical.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseCreator implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        // ✅ Lấy từ System properties, không phải environment
        String host = System.getProperty("DB_HOST");
        String port = System.getProperty("DB_PORT");
        String dbName = System.getProperty("DB_NAME");
        String user = System.getProperty("DB_USER");
        String pass = System.getProperty("DB_PASSWORD");

        String defaultUrl = String.format("jdbc:postgresql://%s:%s/postgres", host, port);

        try (Connection conn = DriverManager.getConnection(defaultUrl, user, pass);
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE \"" + dbName + "\"");
            System.out.println("✅ Database created: " + dbName);
        } catch (SQLException e) {
            if (e.getMessage().contains("already exists")) {
                System.out.println("ℹ️ Database already exists: " + dbName);
            } else {
                System.err.println("❌ Database creation failed: " + e.getMessage());
            }
        }
    }
}
