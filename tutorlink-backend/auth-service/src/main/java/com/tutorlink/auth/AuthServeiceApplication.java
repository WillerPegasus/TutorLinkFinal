package com.tutorlink.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class AuthServeiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServeiceApplication.class, args);
	}

}
