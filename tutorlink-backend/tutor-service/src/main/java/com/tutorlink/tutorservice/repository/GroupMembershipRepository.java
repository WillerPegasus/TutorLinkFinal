package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.GroupMembership;
import com.tutorlink.tutorservice.entity.GroupMembership.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {
    List<GroupMembership> findByGroupIdAndStatus(Long groupId, MembershipStatus status);
    List<GroupMembership> findByStudentId(Long studentId);
    Optional<GroupMembership> findByGroupIdAndStudentId(Long groupId, Long studentId);
    Long countByGroupIdAndStatus(Long groupId, MembershipStatus status);
}