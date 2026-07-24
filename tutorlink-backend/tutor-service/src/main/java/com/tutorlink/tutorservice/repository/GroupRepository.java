package com.tutorlink.tutorservice.repository;

import com.tutorlink.tutorservice.entity.Group;
import com.tutorlink.tutorservice.entity.Group.GroupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByStatus(GroupStatus status);
    List<Group> findByTutorId(Long tutorId);
    List<Group> findBySubjectAndLevel(String subject, String level);
    List<Group> findByCityAndDistrict(String city, String district);
    List<Group> findByMonthlyPriceLessThanEqual(Integer maxPrice);
    Long countByIdAndStatus(Long groupId, GroupStatus status);
}