package com.vn.Medical.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "doctorPatientChat")
public class DoctorPatientChat {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    Long id;
    @ManyToOne
    @JoinColumn(name = "docterId", nullable = false)
    Docter docter;
    @ManyToOne
    @JoinColumn(name = "historyCharId", nullable = false)
    HistoryChat historyChat;
    @JoinColumn(name = "patientId",nullable = false)
    Long patient;
    @Column( nullable = false)
    LocalDate time;
}
