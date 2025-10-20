package com.vn.Medical.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "doctorPatientChat")
public class DoctorPatientChat {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    Long id;
//    @ManyToOne
//    @JoinColumn(name = "DoctorId", nullable = false)
//    Doctor Doctor;
//    @ManyToOne
//    @JoinColumn(name = "historyCharId", nullable = true )
//    HistoryChat historyChat;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "doctor_id", nullable = false)
    Long doctorId;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "history_chat_id")
    Long historyChatId;

    @JoinColumn(name = "patientId",nullable = false)
    Long patientId;
    @Column(nullable = false)
    LocalDate time;
}
