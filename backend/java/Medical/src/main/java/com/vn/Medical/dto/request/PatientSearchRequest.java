package com.vn.Medical.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSearchRequest {
    private String patientId;
    private String patientSex;
    private BigDecimal patientSizeM;
    private String patientAge;
    private BigDecimal patientWeight;
    private String fileId;
    private String previewPngBase64;
    private String fileName;
    private String filePath;
    private String seriesDescription;
    private String noteText;
    private BigDecimal imagePositionXMin;
    private BigDecimal imagePositionXMax;
    private BigDecimal imagePositionYMin;
    private BigDecimal imagePositionYMax;
    private BigDecimal imagePositionZMin;
    private BigDecimal imagePositionZMax;
}
