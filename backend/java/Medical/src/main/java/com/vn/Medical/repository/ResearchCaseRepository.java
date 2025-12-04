package com.vn.Medical.repository;

import com.vn.Medical.entity.ResearchCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchCaseRepository extends JpaRepository<ResearchCase, String> {

    // Thống kê số lượng theo Giới tính
    @Query("SELECT r.gender, COUNT(r) FROM ResearchCase r GROUP BY r.gender")
    List<Object[]> countByGender();

    // Thống kê theo Nhóm tuổi
    @Query(value = "SELECT " +
            "CASE " +
            "  WHEN age < 18 THEN '0-18' " +
            "  WHEN age BETWEEN 18 AND 40 THEN '18-40' " +
            "  WHEN age BETWEEN 41 AND 60 THEN '41-60' " +
            "  ELSE '60+' " +
            "END as age_group, COUNT(*) " +
            "FROM research_case WHERE age IS NOT NULL GROUP BY age_group ORDER BY age_group",
            nativeQuery = true)
    List<Object[]> countByAgeGroup();

    // Top các Bệnh lý phổ biến
    @Query(value = "SELECT 'Cancer/Tumor' as category, COUNT(*) FROM research_case WHERE disease_name ILIKE '%cancer%' OR disease_name ILIKE '%tumor%' OR disease_name ILIKE '%carcinoma%' " +
            "UNION ALL " +
            "SELECT 'Heart/Cardio', COUNT(*) FROM research_case WHERE disease_name ILIKE '%heart%' OR disease_name ILIKE '%cardio%' " +
            "UNION ALL " +
            "SELECT 'Infection', COUNT(*) FROM research_case WHERE disease_name ILIKE '%infection%' OR disease_name ILIKE '%virus%' OR disease_name ILIKE '%bacter%' " +
            "UNION ALL " +
            "SELECT 'Syndrome', COUNT(*) FROM research_case WHERE disease_name ILIKE '%syndrome%'",
            nativeQuery = true)
    List<Object[]> countByDiseaseCategory();

}