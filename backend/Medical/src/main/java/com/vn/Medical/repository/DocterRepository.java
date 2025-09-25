package com.vn.Medical.repository;

import com.vn.Medical.entity.Docter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface DocterRepository extends JpaRepository<Docter,String> {

    Optional<Docter> findByGmail (String gmail);
}
