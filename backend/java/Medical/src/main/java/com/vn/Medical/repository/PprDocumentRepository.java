package com.vn.Medical.repository;

import com.vn.Medical.entity.PprDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PprDocumentRepository extends JpaRepository<PprDocument,String> {
}
