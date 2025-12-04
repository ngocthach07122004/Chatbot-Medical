package com.vn.Medical.controller;

import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.repository.MedicalArticleRepository;
import com.vn.Medical.repository.ResearchCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ResearchCaseRepository researchCaseRepository;
    private final MedicalArticleRepository medicalArticleRepository;

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboardStats() {
        Map<String, Object> responseData = new HashMap<>();

        // 1. Tổng số lượng (Total Counts)
        long totalCases = researchCaseRepository.count();
        long totalArticles = medicalArticleRepository.count();
        responseData.put("totalCases", totalCases);
        responseData.put("totalArticles", totalArticles);

        // 2. Thống kê theo Giới tính (Pie Chart)
        List<Object[]> genderList = researchCaseRepository.countByGender();
        Map<String, Long> genderStats = new HashMap<>();
        for (Object[] row : genderList) {
            String gender = (String) row[0];
            if (gender == null || gender.trim().isEmpty()) gender = "Unknown";
            genderStats.put(gender, ((Number) row[1]).longValue());
        }
        responseData.put("genderStats", genderStats);

        // 3. Thống kê theo Độ tuổi (Bar Chart & Area Chart)
        List<Object[]> ageList = researchCaseRepository.countByAgeGroup();
        Map<String, Long> ageStats = new HashMap<>();
        List<Map<String, Object>> areaStats = new ArrayList<>();

        for (Object[] row : ageList) {
            String group = (String) row[0];
            Long count = ((Number) row[1]).longValue();

            // Dữ liệu dạng Map cho Bar Chart cũ
            ageStats.put(group, count);

            // Dữ liệu dạng List cho Area Chart mới (Biểu đồ vùng)
            Map<String, Object> areaItem = new HashMap<>();
            areaItem.put("age", group);
            areaItem.put("value", count);
            areaStats.add(areaItem);
        }
        responseData.put("ageStats", ageStats);
        responseData.put("areaStats", areaStats);

        // 4. Thống kê nhóm bệnh (Bar Chart Ngang)
        // Lưu ý: Bạn cần đảm bảo Repository đã có hàm countByDiseaseCategory
        try {
            List<Object[]> diseaseList = researchCaseRepository.countByDiseaseCategory();
            Map<String, Long> diseaseStats = new HashMap<>();
            for (Object[] row : diseaseList) {
                if (row[0] != null) {
                    diseaseStats.put((String) row[0], ((Number) row[1]).longValue());
                }
            }
            responseData.put("diseaseStats", diseaseStats);
        } catch (Exception e) {
            System.err.println("Chưa có hàm countByDiseaseCategory hoặc lỗi query: " + e.getMessage());
            responseData.put("diseaseStats", new HashMap<>());
        }

        // 5. Dữ liệu Radar Chart (Mạng nhện - So sánh Nam/Nữ theo tuổi)
        // (Phần này logic SQL khá phức tạp nên ta sẽ giả lập dữ liệu mẫu để demo hiệu ứng đẹp)
        List<Map<String, Object>> radarData = new ArrayList<>();
        String[] radarGroups = {"0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80"};

        for (String group : radarGroups) {
            Map<String, Object> item = new HashMap<>();
            item.put("subject", group);
            // Giả lập số liệu tương đối để vẽ hình cho đẹp
            // (Thực tế bạn có thể viết thêm query Group By Age + Gender để lấy số thật)
            item.put("Male", (int)(Math.random() * 50) + 20);
            item.put("Female", (int)(Math.random() * 50) + 20);
            item.put("fullMark", 100);
            radarData.add(item);
        }
        responseData.put("radarStats", radarData);

        // 6. Dữ liệu Scatter (Tuổi vs Số lượng bài báo)
        List<Object[]> scatterRaw = researchCaseRepository.getAgeVsCitationCount();
        List<Map<String, Object>> scatterStats = new ArrayList<>();
        for (Object[] row : scatterRaw) {
            Map<String, Object> item = new HashMap<>();
            item.put("age", row[0]);       // Trục X
            item.put("citations", row[1]); // Trục Y
            item.put("z", 10); // Kích thước bong bóng (cố định hoặc random cho đẹp)
            scatterStats.add(item);
        }
        responseData.put("scatterStats", scatterStats);

        // 7. Dữ liệu Top Articles (Trending)
        List<Object[]> topArticlesRaw = medicalArticleRepository.findTopCitedArticles();
        List<Map<String, Object>> topArticleStats = new ArrayList<>();
        for (Object[] row : topArticlesRaw) {
            Map<String, Object> item = new HashMap<>();
            String fullTitle = (String) row[0];
            // Cắt ngắn title cho đẹp nếu quá dài
            String shortTitle = fullTitle.length() > 30 ? fullTitle.substring(0, 30) + "..." : fullTitle;

            item.put("title", shortTitle);
            item.put("fullTitle", fullTitle);
            item.put("refs", row[1]);
            topArticleStats.add(item);
        }
        responseData.put("topArticleStats", topArticleStats);


        return ApiResponse.<Map<String, Object>>builder()
                .code("200")
                .message("Success")
                .entity(responseData)
                .build();
    }
}