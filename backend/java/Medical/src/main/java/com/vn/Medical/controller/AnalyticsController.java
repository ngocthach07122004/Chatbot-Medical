package com.vn.Medical.controller;

import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.repository.ResearchCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ResearchCaseRepository researchCaseRepository;

    // private final MedicalArticleRepository medicalArticleRepository;

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboardStats() {
        Map<String, Object> responseData = new HashMap<>();

        // Tổng số lượng hồ sơ (Total Patients)
        long totalCases = researchCaseRepository.count();
        responseData.put("totalCases", totalCases);

        // Thống kê theo Giới tính
        List<Object[]> genderList = researchCaseRepository.countByGender();
        Map<String, Long> genderStats = new HashMap<>();
        for (Object[] row : genderList) {
            String gender = (String) row[0];
            if (gender == null || gender.trim().isEmpty()) gender = "Unknown";
            genderStats.put(gender, ((Number) row[1]).longValue());
        }
        responseData.put("genderStats", genderStats);

        // Thống kê theo Độ tuổi
        List<Object[]> ageList = researchCaseRepository.countByAgeGroup();
        Map<String, Long> ageStats = new HashMap<>();
        for (Object[] row : ageList) {
            String group = (String) row[0];
            ageStats.put(group, ((Number) row[1]).longValue());
        }
        responseData.put("ageStats", ageStats);

        // Thống kê nhóm bệnh (Disease Categories)
        List<Object[]> diseaseList = researchCaseRepository.countByDiseaseCategory(); // Nhớ thêm hàm này vào Repository như ở trên
        Map<String, Long> diseaseStats = new HashMap<>();
        for (Object[] row : diseaseList) {
            diseaseStats.put((String) row[0], ((Number) row[1]).longValue());
        }
        responseData.put("diseaseStats", diseaseStats);

        return ApiResponse.<Map<String, Object>>builder()
                .code("200")
                .message("Success")
                .entity(responseData)
                .build();
    }
}