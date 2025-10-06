package com.vn.Medical.repository;

import com.vn.Medical.entity.DoctorPatientChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DoctorPatientChatRepository extends JpaRepository<DoctorPatientChat, Long> {
    @Query(value = "SELECT  hc.time, hc.historyChat.id FROM DoctorPatientChat as hc WHERE hc.docter.id = :doctorId AND hc.patient = :patiendId GROUP BY hc.time")
    List<Object[]> findHistoryChatsByDoctorAndPatient(@Param("doctorId") String doctorId, @Param("patiendId") Long patientId);
}
