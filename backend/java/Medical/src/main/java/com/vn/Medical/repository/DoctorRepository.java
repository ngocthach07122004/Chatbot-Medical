package com.vn.Medical.repository;

import com.vn.Medical.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface DoctorRepository extends JpaRepository<Doctor,Long> {

    Optional<Doctor> findByGmail (String gmail);
}
