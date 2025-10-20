package com.vn.Medical.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vn.Medical.helper.JsonNodeConverter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "historyChat")
@FieldDefaults(level =  AccessLevel.PRIVATE)
@Data
public class HistoryChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "data", columnDefinition = "jsonb")
    @Convert(converter = JsonNodeConverter.class)
    JsonNode data;
    @Column(name = "createdAt")
    LocalDateTime createdAt;
//    @OneToMany(mappedBy = "historyChat", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<DoctorPatientChat> doctorPatientChats = new HashSet<>();
}
