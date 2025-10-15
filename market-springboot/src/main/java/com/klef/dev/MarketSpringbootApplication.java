package com.klef.dev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarketSpringbootApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketSpringbootApplication.class, args);
        System.out.println("Backend is Running ...");
    }

}
