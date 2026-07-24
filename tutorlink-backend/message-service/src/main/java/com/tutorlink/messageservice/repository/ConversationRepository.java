package com.tutorlink.messageservice.repository;

import com.tutorlink.messageservice.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByParticipantOneIdOrParticipantTwoIdOrderByLastMessageAtDesc(
            Long participantOneId, Long participantTwoId);

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participantOneId = :userA AND c.participantTwoId = :userB) OR " +
           "(c.participantOneId = :userB AND c.participantTwoId = :userA)")
    Optional<Conversation> findByParticipants(
            @Param("userA") Long userA,
            @Param("userB") Long userB);
}