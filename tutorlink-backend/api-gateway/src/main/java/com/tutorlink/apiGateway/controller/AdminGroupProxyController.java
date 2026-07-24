package com.tutorlink.apiGateway.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

// ✎ AJOUT — alias /api/admin/groups/** attendus par le frontend
@RestController
@RequestMapping("/api/admin/groups")
@RequiredArgsConstructor
public class AdminGroupProxyController {

    private final RestTemplate restTemplate;

    @Value("${services.tutor-service.url}")
    private String tutorServiceUrl;

    @GetMapping
    public ResponseEntity<List> getGroups() {
        List groups = restTemplate.getForObject(tutorServiceUrl + "/api/groups", List.class);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List> getGroupMembers(@PathVariable Long id) {
        List members = restTemplate.getForObject(tutorServiceUrl + "/api/groups/" + id + "/members", List.class);
        return ResponseEntity.ok(members);
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Void> verifyGroup(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/groups/" + id + "/verify", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/suspend")
    public ResponseEntity<Void> suspendGroup(@PathVariable Long id) {
        restTemplate.patchForObject(tutorServiceUrl + "/api/groups/" + id + "/suspend", null, Void.class);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        restTemplate.delete(tutorServiceUrl + "/api/groups/" + id);
        return ResponseEntity.noContent().build();
    }
}