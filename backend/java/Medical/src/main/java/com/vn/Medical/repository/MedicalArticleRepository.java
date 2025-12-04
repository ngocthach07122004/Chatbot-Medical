package com.vn.Medical.repository;

import com.vn.Medical.entity.MedicalArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalArticleRepository extends JpaRepository<MedicalArticle, String> {
    // Top 10 bài báo được tham khảo nhiều nhất (Trending Knowledge)
    @Query(value = "SELECT a.title, COUNT(r.case_id) as refs " +
            "FROM medical_article a " +
            "JOIN research_relevance r ON a.id = r.article_id " +
            "GROUP BY a.id, a.title " +
            "ORDER BY refs DESC " +
            "LIMIT 10",
            nativeQuery = true)
    List<Object[]> findTopCitedArticles();


}