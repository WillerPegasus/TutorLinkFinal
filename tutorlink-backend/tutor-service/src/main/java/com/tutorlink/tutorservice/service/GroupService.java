package com.tutorlink.tutorservice.service;

import com.tutorlink.tutorservice.client.MtnMomoClient;
import com.tutorlink.tutorservice.client.OrangeMomoClient;
import com.tutorlink.tutorservice.dto.*;
import com.tutorlink.tutorservice.entity.Group;
import com.tutorlink.tutorservice.entity.Group.GroupStatus;
import com.tutorlink.tutorservice.entity.GroupMembership;
import com.tutorlink.tutorservice.entity.GroupMembership.MembershipStatus;
import com.tutorlink.tutorservice.feign.NotificationServiceClient;
import com.tutorlink.tutorservice.repository.GroupMembershipRepository;
import com.tutorlink.tutorservice.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMembershipRepository membershipRepository;
    private final NotificationServiceClient notificationServiceClient;
    private final MtnMomoClient mtnMomoClient;
    private final OrangeMomoClient orangeMomoClient;

    public GroupResponse createGroup(Long tutorId, GroupRequest request) {
        Group group = Group.builder()
                .tutorId(tutorId)
                .name(request.getName())
                .subject(request.getSubject())
                .level(request.getLevel())
                .city(request.getCity())
                .district(request.getDistrict())
                .maxCapacity(request.getMaxCapacity())
                .monthlyPrice(request.getMonthlyPrice())
                .description(request.getDescription())
                .schedules(request.getSchedules())
                .status(GroupStatus.ACTIVE)
                .build();
        return mapToResponse(groupRepository.save(group));
    }

    public GroupResponse getGroupById(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));
        return mapToResponse(group);
    }

    public List<GroupResponse> getAllGroups(String subject, String level, String city, Integer maxPrice) {
        List<Group> groups = groupRepository.findAll();

        return groups.stream()
                .filter(g -> subject == null || subject.isBlank()
                        || g.getSubject().equalsIgnoreCase(subject))
                .filter(g -> level == null || level.isBlank()
                        || g.getLevel().equalsIgnoreCase(level))
                .filter(g -> city == null || city.isBlank()
                        || (g.getCity() != null && g.getCity().equalsIgnoreCase(city)))
                .filter(g -> maxPrice == null
                        || (g.getMonthlyPrice() != null && g.getMonthlyPrice() <= maxPrice))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GroupResponse updateGroup(Long groupId, GroupRequest request) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));
        group.setName(request.getName());
        group.setSubject(request.getSubject());
        group.setLevel(request.getLevel());
        group.setCity(request.getCity());
        group.setDistrict(request.getDistrict());
        group.setMaxCapacity(request.getMaxCapacity());
        group.setMonthlyPrice(request.getMonthlyPrice());
        group.setDescription(request.getDescription());
        group.setSchedules(request.getSchedules());
        return mapToResponse(groupRepository.save(group));
    }

    public void deleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));
        group.setStatus(GroupStatus.CLOSED);
        groupRepository.save(group);
    }
    // ✎ AJOUT — suspension admin d'un groupe
    public void suspendGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));
        group.setStatus(GroupStatus.SUSPENDED);
        groupRepository.save(group);
    }

    // ✎ AJOUT — réactivation admin d'un groupe suspendu
    public void reactivateGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));
        group.setStatus(GroupStatus.ACTIVE);
        groupRepository.save(group);
    }

    public GroupMembershipResponse joinGroup(Long groupId, Long studentId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé : " + groupId));

        Long currentCount = membershipRepository.countByGroupIdAndStatus(groupId, MembershipStatus.ACTIVE);
        MembershipStatus status = currentCount < group.getMaxCapacity()
                ? MembershipStatus.ACTIVE : MembershipStatus.WAITING;

        boolean becameFull = false;
        if (status == MembershipStatus.ACTIVE && currentCount + 1 >= group.getMaxCapacity()) {
            group.setStatus(GroupStatus.FULL);
            groupRepository.save(group);
            becameFull = true;
        }

        GroupMembership membership = GroupMembership.builder()
                .groupId(groupId)
                .studentId(studentId)
                .status(status)
                .build();

        GroupMembership saved = membershipRepository.save(membership);

        sendNotificationSafely(studentId, "GROUP_JOINED",
                "Inscription au groupe",
                "Vous avez rejoint le groupe \"" + group.getName() + "\" avec le statut " + status);

        if (becameFull) {
            sendNotificationSafely(group.getTutorId(), "GROUP_FULL",
                    "Groupe complet",
                    "Votre groupe \"" + group.getName() + "\" est maintenant complet.");
        }

        return mapMembershipToResponse(saved);
    }

    public void leaveGroup(Long groupId, Long studentId) {
        GroupMembership membership = membershipRepository
                .findByGroupIdAndStudentId(groupId, studentId)
                .orElseThrow(() -> new RuntimeException("Membership non trouvé"));
        membership.setStatus(MembershipStatus.CANCELLED);
        membershipRepository.save(membership);

        Group group = groupRepository.findById(groupId).orElseThrow();
        if (group.getStatus() == GroupStatus.FULL) {
            group.setStatus(GroupStatus.ACTIVE);
            groupRepository.save(group);

            List<GroupMembership> waiting = membershipRepository
                    .findByGroupIdAndStatus(groupId, MembershipStatus.WAITING);
            if (!waiting.isEmpty()) {
                GroupMembership first = waiting.get(0);
                first.setStatus(MembershipStatus.ACTIVE);
                membershipRepository.save(first);

                sendNotificationSafely(first.getStudentId(), "GROUP_JOINED",
                        "Place disponible",
                        "Une place s'est libérée dans le groupe \"" + group.getName() + "\", vous êtes maintenant inscrit.");
            }
        }
    }
    // ✎ FIX — retrouve la membership d'un étudiant dans un groupe donné
    public GroupMembershipResponse getMembershipForStudent(Long groupId, Long studentId) {
        GroupMembership membership = membershipRepository
                .findByGroupIdAndStudentId(groupId, studentId)
                .orElseThrow(() -> new RuntimeException("Vous n'êtes pas inscrit à ce groupe"));
        return mapMembershipToResponse(membership);
    }

    public List<GroupResponse> getGroupsByTutor(Long tutorId) {
        return groupRepository.findByTutorId(tutorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<GroupMembershipResponse> getGroupsByStudent(Long studentId) {
        return membershipRepository.findByStudentId(studentId).stream()
                .map(this::mapMembershipToResponse)
                .collect(Collectors.toList());
    }

    // ✎ AJOUT — vue enrichie pour la page "Mes groupes" côté élève :
    // fusionne chaque GroupMembership avec les infos du Group associé
    // (nom, matière, prix...), absentes de GroupMembershipResponse.
    public List<com.tutorlink.tutorservice.dto.StudentGroupResponse> getStudentGroupsEnriched(Long studentId) {
        return membershipRepository.findByStudentId(studentId).stream()
                .map(m -> {
                    Group g = groupRepository.findById(m.getGroupId()).orElse(null);
                    return com.tutorlink.tutorservice.dto.StudentGroupResponse.builder()
                            .membershipId(m.getId())
                            .groupId(m.getGroupId())
                            .name(g != null ? g.getName() : "")
                            .subject(g != null ? g.getSubject() : "")
                            .level(g != null ? g.getLevel() : "")
                            .city(g != null ? g.getCity() : "")
                            .district(g != null ? g.getDistrict() : "")
                            .tutorId(g != null ? g.getTutorId() : null)
                            .monthlyPrice(g != null ? g.getMonthlyPrice() : 0)
                            .schedules(g != null ? g.getSchedules() : "")
                            .status(g != null ? g.getStatus().name() : "")
                            .memberStatus(m.getStatus().name())
                            .joinedAt(m.getJoinedAt())
                            .lastPaymentDate(m.getLastPaymentDate())
                            .upToDate(m.getLastPaymentDate() != null &&
                                    !m.getLastPaymentDate().isBefore(java.time.LocalDate.now().withDayOfMonth(1)))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<GroupMembershipResponse> getGroupMembers(Long groupId) {
        return membershipRepository.findByGroupIdAndStatus(groupId, MembershipStatus.ACTIVE).stream()
                .map(this::mapMembershipToResponse)
                .collect(Collectors.toList());
    }

    // ── Paiement abonnement — MTN MoMo (synchrone : push + vérif immédiate) ──
    public GroupMembershipResponse payMembershipMtn(Long membershipId, String phoneNumber) {
        GroupMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership non trouvé : " + membershipId));

        Group group = groupRepository.findById(membership.getGroupId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        String referenceId = mtnMomoClient.requestPayment(
                phoneNumber,
                group.getMonthlyPrice(),
                "GROUP-" + membershipId
        );

        String status = mtnMomoClient.checkPaymentStatus(referenceId);

        if ("SUCCESSFUL".equals(status)) {
            membership.setLastPaymentDate(LocalDate.now());
            membershipRepository.save(membership);

            sendNotificationSafely(membership.getStudentId(), "PAYMENT_RECEIVED",
                    "Paiement enregistré",
                    "Votre paiement mensuel a bien été enregistré (MTN MoMo).");
        } else {
            throw new RuntimeException("Paiement MTN non confirmé, statut : " + status);
        }

        return mapMembershipToResponse(membership);
    }

    // ── Paiement abonnement — Orange Money (asynchrone : init + callback) ───
    // Étape 1 : on initie le paiement et on retourne l'URL de redirection au front.
    public Map<String, String> initOrangePayment(Long membershipId) {
        GroupMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership non trouvé : " + membershipId));

        Group group = groupRepository.findById(membership.getGroupId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        String orderId = "GROUP-" + membershipId + "-" + System.currentTimeMillis();

        Map<String, String> result = orangeMomoClient.initPayment(
                group.getMonthlyPrice(),
                orderId,
                "Abonnement groupe " + group.getName()
        );

        // On stocke orderId/payToken pour pouvoir les retrouver au callback.
        // Si tu veux persister ça en base, ajoute les champs orderId/payToken
        // à GroupMembership ; pour l'instant on les renvoie au frontend qui
        // devra les renvoyer lui-même lors de l'appel de vérification.
        result.put("orderId", orderId);
        result.put("membershipId", String.valueOf(membershipId));

        return result;
    }

    // Étape 2 : appelée par le endpoint de notification (notif_url) une fois
    // que l'utilisateur a validé (ou annulé) le paiement côté Orange.
    public GroupMembershipResponse confirmOrangePayment(Long membershipId, String orderId, String payToken) {
        GroupMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership non trouvé : " + membershipId));

        Group group = groupRepository.findById(membership.getGroupId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));

        String status = orangeMomoClient.checkPaymentStatus(orderId, group.getMonthlyPrice(), payToken);

        if ("SUCCESS".equals(status)) {
            membership.setLastPaymentDate(LocalDate.now());
            membershipRepository.save(membership);

            sendNotificationSafely(membership.getStudentId(), "PAYMENT_RECEIVED",
                    "Paiement enregistré",
                    "Votre paiement mensuel a bien été enregistré (Orange Money).");
        } else {
            throw new RuntimeException("Paiement Orange non confirmé, statut : " + status);
        }

        return mapMembershipToResponse(membership);
    }

    private boolean isUpToDate(GroupMembership m) {
        return m.getLastPaymentDate() != null
                && m.getLastPaymentDate().isAfter(LocalDate.now().minusDays(30));
    }

    // ── Stats admin ──────────────────────────────────────────────────────────
    public Long countActiveGroups() {
        return (long) groupRepository.findByStatus(GroupStatus.ACTIVE).size();
    }
    // ✎ AJOUT — vue admin "abonnements de groupe" : il n'existe pas de notion
    // distincte d'abonnement de groupe, on agrège Group + GroupMembership
    // (membres actifs/en attente, combien sont à jour de paiement).
    public List<Map<String, Object>> getGroupSubscriptionsOverview() {
        return groupRepository.findAll().stream().map(group -> {
            List<GroupMembership> active = membershipRepository
                    .findByGroupIdAndStatus(group.getId(), MembershipStatus.ACTIVE);
            List<GroupMembership> waiting = membershipRepository
                    .findByGroupIdAndStatus(group.getId(), MembershipStatus.WAITING);
            long upToDateCount = active.stream().filter(this::isUpToDate).count();

            Map<String, Object> row = new HashMap<>();
            row.put("groupId", group.getId());
            row.put("groupName", group.getName());
            row.put("tutorId", group.getTutorId());
            row.put("monthlyPrice", group.getMonthlyPrice());
            row.put("maxCapacity", group.getMaxCapacity());
            row.put("activeMembers", active.size());
            row.put("waitingMembers", waiting.size());
            row.put("membersUpToDate", upToDateCount);
            row.put("membersLate", active.size() - upToDateCount);
            row.put("status", group.getStatus());
            return row;
        }).collect(Collectors.toList());
    }
// ✎ AJOUT — "suggestions" simplifiées : groupes actifs les plus récents.
    // Pas de vraie personnalisation pour l'instant (pas de données de
    // préférences étudiant disponibles) — à améliorer plus tard.
    public List<GroupResponse> getSuggestedGroups() {
        return groupRepository.findByStatus(GroupStatus.ACTIVE)
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(this::mapToResponse)
                .toList();
    }
    // ── Notifications (T19) ─────────────────────────────────────────────────
    private void sendNotificationSafely(Long userId, String type, String title, String content) {
        try {
            Map<String, Object> notifData = new HashMap<>();
            notifData.put("userId", userId);
            notifData.put("type", type);
            notifData.put("title", title);
            notifData.put("content", content);
            notificationServiceClient.sendNotification(notifData);
        } catch (Exception e) {
            System.out.println("[WARNING] Impossible d'envoyer la notification " + type + " : " + e.getMessage());
        }
    }

    // ── Mappers ──────────────────────────────────────────────────────────────
    private GroupResponse mapToResponse(Group group) {
        Long currentCount = membershipRepository.countByGroupIdAndStatus(group.getId(), MembershipStatus.ACTIVE);
        return GroupResponse.builder()
                .id(group.getId())
                .tutorId(group.getTutorId())
                .name(group.getName())
                .subject(group.getSubject())
                .level(group.getLevel())
                .city(group.getCity())
                .district(group.getDistrict())
                .maxCapacity(group.getMaxCapacity())
                .currentCount(currentCount.intValue())
                .monthlyPrice(group.getMonthlyPrice())
                .description(group.getDescription())
                .schedules(group.getSchedules())
                .status(group.getStatus())
                .createdAt(group.getCreatedAt())
                .build();
    }

    private GroupMembershipResponse mapMembershipToResponse(GroupMembership m) {
        return GroupMembershipResponse.builder()
                .id(m.getId())
                .groupId(m.getGroupId())
                .studentId(m.getStudentId())
                .joinedAt(m.getJoinedAt())
                .status(m.getStatus())
                .lastPaymentDate(m.getLastPaymentDate())
                .upToDate(isUpToDate(m))
                .build();
    }
}