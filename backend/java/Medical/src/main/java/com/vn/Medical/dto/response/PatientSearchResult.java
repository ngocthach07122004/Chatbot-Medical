package com.vn.Medical.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSearchResult {
    private String patientId;
    private String patientSex;
    private String patientAge;
    private BigDecimal patientWeight;
    private BigDecimal patientSizeM;
    private String fileName;
    private String filePath;
    private String seriesDescription;
    private String noteText;
    private Double imagePositionX;
    private Double imagePositionY;
    private Double imagePositionZ;
    private String previewPngBase64;
    private Map<String, Object> raw;
}
