package com.tutorlink.tutorservice.controller;

import com.tutorlink.tutorservice.dto.*;
import com.tutorlink.tutorservice.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final com.tutorlink.tutorservice.service.TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getAllGroups(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer maxPrice) {
        return ResponseEntity.ok(groupService.getAllGroups(subject, level, city, maxPrice));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupById(groupId));
    }
    // ✎ AJOUT — groupes suggérés (liste simplifiée pour l'instant)
    @GetMapping("/suggested")
    public ResponseEntity<List<GroupResponse>> getSuggestedGroups() {
        return ResponseEntity.ok(groupService.getSuggestedGroups());
    }

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(
            @RequestParam Long tutorId,
            @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.createGroup(tutorId, request));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<GroupResponse> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.updateGroup(groupId, request));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.noContent().build();
    }
    // ✎ AJOUT — actions admin sur un groupe
    @PatchMapping("/{groupId}/suspend")
    public ResponseEntity<Void> suspendGroup(@PathVariable Long groupId) {
        groupService.suspendGroup(groupId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{groupId}/verify")
    public ResponseEntity<Void> reactivateGroup(@PathVariable Long groupId) {
        groupService.reactivateGroup(groupId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<GroupMembershipResponse> joinGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody JoinGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.joinGroup(groupId, request.getStudentId()));
    }

    @DeleteMapping("/{groupId}/leave")
    public ResponseEntity<Void> leaveGroup(
            @PathVariable Long groupId,
            @RequestParam Long studentId) {
        groupService.leaveGroup(groupId, studentId);
        return ResponseEntity.noContent().build();
    }
    // ✎ FIX — POST /api/groups/{groupId}/leave
    // Alias attendu par le frontend : pas de query param, le studentId
    // vient du header X-User-Id injecté par la gateway depuis le JWT.
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<Void> leaveGroupViaPost(
            @PathVariable Long groupId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }
        groupService.leaveGroup(groupId, Long.parseLong(requesterId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<GroupResponse>> getGroupsByTutor(@PathVariable Long tutorId) {
        return ResponseEntity.ok(groupService.getGroupsByTutor(tutorId));
    }
    // ✎ AJOUT — avis du tuteur qui anime ce groupe (pas d'avis "de groupe" en tant que tel)
    @GetMapping("/{groupId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getGroupReviews(@PathVariable Long groupId) {
        Long tutorId = groupService.getGroupById(groupId).getTutorId();
        return ResponseEntity.ok(tutorService.getReviewsByTutor(tutorId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GroupMembershipResponse>> getGroupsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(groupService.getGroupsByStudent(studentId));
    }

    // ✎ AJOUT — vue enrichie (nom, matière, prix...) pour la page
    // "Mes groupes" côté élève. Distinct de /student/{id} pour ne pas
    // casser les consommateurs existants de GroupMembershipResponse.
    @GetMapping("/student/{studentId}/enriched")
    public ResponseEntity<List<com.tutorlink.tutorservice.dto.StudentGroupResponse>> getStudentGroupsEnriched(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(groupService.getStudentGroupsEnriched(studentId));
    }


    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMembershipResponse>> getGroupMembers(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }
    // ✎ FIX — GET /api/groups/{groupId}/my-membership
    // Permet au frontend de récupérer le membershipId de l'utilisateur
    // connecté dans ce groupe, nécessaire pour appeler les endpoints
    // de paiement /memberships/{membershipId}/pay/...
    @GetMapping("/{groupId}/my-membership")
    public ResponseEntity<GroupMembershipResponse> getMyMembership(
            @PathVariable Long groupId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(
                groupService.getMembershipForStudent(groupId, Long.parseLong(requesterId))
        );
    }
    // ✎ AJOUT — POST /api/groups/{groupId}/waitlist — s'inscrire en liste
    // d'attente. Réutilise joinGroup() qui bascule déjà automatiquement en
    // WAITING si le groupe est complet (voir GroupService.joinGroup).
    @PostMapping("/{groupId}/waitlist")
    public ResponseEntity<GroupMembershipResponse> joinWaitlist(
            @PathVariable Long groupId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.joinGroup(groupId, Long.parseLong(requesterId)));
    }

    // ✎ AJOUT — POST /api/groups/{groupId}/pay — alias pratique pour l'élève
    // connecté : résout automatiquement son membershipId puis dispatch vers
    // MTN ou Orange. Body attendu : { "method": "MTN"|"Orange", "phoneNumber": "6XXXXXXXX" }
    // (phoneNumber requis seulement pour MTN)
    @PostMapping("/{groupId}/pay")
    public ResponseEntity<Object> payGroupMonthly(
            @PathVariable Long groupId,
            @RequestHeader(value = "X-User-Id", required = false) String requesterId,
            @RequestBody Map<String, String> body) {

        if (requesterId == null) {
            return ResponseEntity.status(401).build();
        }

        GroupMembershipResponse membership =
                groupService.getMembershipForStudent(groupId, Long.parseLong(requesterId));

        if ("MTN".equalsIgnoreCase(body.get("method"))) {
            return ResponseEntity.ok(
                    groupService.payMembershipMtn(membership.getId(), body.get("phoneNumber")));
        } else {
            return ResponseEntity.ok(groupService.initOrangePayment(membership.getId()));
        }
    }

    // ── Paiement — MTN MoMo (synchrone) ─────────────────────────────────────
    @PostMapping("/memberships/{membershipId}/pay/mtn")
    public ResponseEntity<GroupMembershipResponse> payMembershipMtn(
            @PathVariable Long membershipId,
            @RequestParam String phoneNumber) {
        return ResponseEntity.ok(groupService.payMembershipMtn(membershipId, phoneNumber));
    }

    // ── Paiement — Orange Money, étape 1 : initier (renvoie l'URL de redirection) ──
    @PostMapping("/memberships/{membershipId}/pay/orange/init")
    public ResponseEntity<Map<String, String>> initOrangePayment(@PathVariable Long membershipId) {
        return ResponseEntity.ok(groupService.initOrangePayment(membershipId));
    }

    // ── Paiement — Orange Money, étape 2 : confirmation (appelée par le callback notif_url,
    // ou manuellement par le frontend après redirection retour) ─────────────
    @PostMapping("/memberships/{membershipId}/pay/orange/confirm")
    public ResponseEntity<GroupMembershipResponse> confirmOrangePayment(
            @PathVariable Long membershipId,
            @RequestParam String orderId,
            @RequestParam String payToken) {
        return ResponseEntity.ok(groupService.confirmOrangePayment(membershipId, orderId, payToken));
    }

    // NOTE — le endpoint des stats actives a été déplacé dans AdminStatsController
    // (chemin /api/admin/stats/groups/active, pas /api/groups/admin/stats/groups/active)
}