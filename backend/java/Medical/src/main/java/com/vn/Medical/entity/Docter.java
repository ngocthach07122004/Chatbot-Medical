package com.vn.Medical.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class Docter {
    @Id
    @GeneratedValue(strategy =  GenerationType.UUID)
    String id;
    String gmail;
    String password;
    int age;
    String fullName;

}
