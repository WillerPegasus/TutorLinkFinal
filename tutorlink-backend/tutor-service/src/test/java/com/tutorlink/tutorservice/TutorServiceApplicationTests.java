package com.tutorlink.tutorservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = TutorServiceApplication.class)
@ActiveProfiles("test")
class TutorServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}