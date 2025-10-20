package com.vn.Medical.repository;

import com.vn.Medical.entity.DoctorPatientChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DoctorPatientChatRepository extends JpaRepository<DoctorPatientChat, Long> {
//    @Query(value = "SELECT  hc.time, hc.historyChat.id FROM DoctorPatientChat as hc WHERE hc.Doctor.id = :doctorId AND hc.patient = :patiendId GROUP BY hc.time")
//    @Query(value = "SELECT  hc.time, hc.historyChatId FROM DoctorPatientChat as hc WHERE hc.doctorId = :doctorId AND hc.patient = :patiendId GROUP BY hc.time")
//    List<Object[]> findHistoryChatsByDoctorAndPatient(@Param("doctorId") Long doctorId, @Param("patiendId") Long patientId);
@Query(value = """
        SELECT hc.time, hc.history_chat_id
        FROM doctor_patient_chat hc
        WHERE hc.doctor_id = :doctorId
          AND hc.patient_id = :patientId
        GROUP BY hc.time, hc.history_chat_id
        """, nativeQuery = true)
List<Object[]> findHistoryChatsByDoctorAndPatient(
        @Param("doctorId") Long doctorId,
        @Param("patientId") Long patientId
);
}
