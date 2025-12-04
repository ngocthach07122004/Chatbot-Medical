package com.vn.Medical.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "research_case")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResearchCase {
    @Id
    String id; // Map với id (human_patient_uid) trong DB

    Double age;
    String gender;

    @Column(name = "disease_name", columnDefinition = "TEXT")
    String diseaseName;

    @Column(columnDefinition = "TEXT")
    String description;
}