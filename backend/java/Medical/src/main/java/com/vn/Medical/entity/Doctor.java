package com.vn.Medical.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    Long id;
    String gmail;
    String password;
    int age;
    String fullName;
//    @OneToMany(mappedBy = "doctorId", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<DoctorPatientChat> dockerPatientChats = new HashSet<>();
}
