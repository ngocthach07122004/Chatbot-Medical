package com.vn.Medical.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.vn.Medical.helper.JsonNodeConverter;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;
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
    @Column(name = "data", columnDefinition = "jsonb")
//    @Convert(converter = JsonNodeConverter.class)
    @Type(JsonType.class)
    JsonNode data;

//    @OneToMany(mappedBy = "doctorId", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<DoctorPatientChat> dockerPatientChats = new HashSet<>();
}
