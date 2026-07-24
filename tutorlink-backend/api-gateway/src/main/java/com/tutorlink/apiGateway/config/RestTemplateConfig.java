package com.tutorlink.apiGateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // ✎ FIX — SimpleClientHttpRequestFactory (par défaut) ne supporte pas
    // PATCH. JdkClientHttpRequestFactory (basé sur java.net.http.HttpClient,
    // disponible depuis Java 11) le supporte nativement.
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(new JdkClientHttpRequestFactory());
    }
}