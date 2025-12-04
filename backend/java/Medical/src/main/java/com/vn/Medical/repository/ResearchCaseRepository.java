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
//    @Query(value = "SELECT " +
//            "CASE " +
//            "  WHEN age < 18 THEN '0-18' " +
//            "  WHEN age BETWEEN 18 AND 40 THEN '18-40' " +
//            "  WHEN age BETWEEN 41 AND 60 THEN '41-60' " +
//            "  ELSE '60+' " +
//            "END as age_group, COUNT(*) " +
//            "FROM research_case WHERE age IS NOT NULL GROUP BY age_group ORDER BY age_group",
//            nativeQuery = true)
//    List<Object[]> countByAgeGroup();
    @Query(value = "SELECT " +
            "CASE " +
            "  WHEN age <= 10 THEN '0-10' " +
            "  WHEN age > 10 AND age <= 20 THEN '11-20' " +
            "  WHEN age > 20 AND age <= 30 THEN '21-30' " +
            "  WHEN age > 30 AND age <= 40 THEN '31-40' " +
            "  WHEN age > 40 AND age <= 50 THEN '41-50' " +
            "  WHEN age > 50 AND age <= 60 THEN '51-60' " +
            "  WHEN age > 60 AND age <= 70 THEN '61-70' " +
            "  WHEN age > 70 AND age <= 80 THEN '71-80' " +
            "  ELSE '80+' " +
            "END as age_group, COUNT(*) " +
            "FROM research_case WHERE age IS NOT NULL GROUP BY age_group",
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

    // Lấy cặp dữ liệu (Tuổi - Số lượng bài báo tham khảo) để vẽ Scatter Plot
    @Query(value = "SELECT c.age, COUNT(r.article_id) " +
            "FROM research_case c " +
            "LEFT JOIN research_relevance r ON c.id = r.case_id " +
            "WHERE c.age IS NOT NULL " +
            "GROUP BY c.id, c.age " +
            "HAVING COUNT(r.article_id) > 0",
            nativeQuery = true)
    List<Object[]> getAgeVsCitationCount();

    // Thống kê phân bổ số lượng trích dẫn (Có bao nhiêu ca bệnh có 1 ref, 2 refs, 5 refs...?)
    @Query(value = "SELECT ref_count, COUNT(*) FROM " +
            "(SELECT case_id, COUNT(*) as ref_count FROM research_relevance GROUP BY case_id) as sub " +
            "GROUP BY ref_count ORDER BY ref_count ASC",
            nativeQuery = true)
    List<Object[]> getCitationDistribution();

}