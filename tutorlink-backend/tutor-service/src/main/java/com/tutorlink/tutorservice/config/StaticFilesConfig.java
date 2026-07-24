package com.tutorlink.tutorservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// ✎ AJOUT — expose uploadDir en fichiers statiques via /files/documents/**
@Configuration
public class StaticFilesConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/documents/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}