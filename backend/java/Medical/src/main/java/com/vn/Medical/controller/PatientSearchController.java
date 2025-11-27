package com.vn.Medical.controller;

import com.vn.Medical.dto.request.PatientSearchRequest;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.dto.response.PatientSearchResult;
import com.vn.Medical.service.PatientSearchService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class PatientSearchController {

    PatientSearchService patientSearchService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<PatientSearchResult>>> search(
            @RequestParam(name = "patient_id", required = false) String patientId,
            @RequestParam(name = "patient_sex", required = false) String patientSex,
            @RequestParam(name = "patient_size_m", required = false) BigDecimal patientSizeM,
            @RequestParam(name = "patient_age", required = false) String patientAge,
            @RequestParam(name = "patient_weight", required = false) BigDecimal patientWeight,
            @RequestParam(name = "file_id", required = false) String fileId,
            @RequestParam(name = "preview_png", required = false) String previewPngBase64,
            @RequestParam(name = "file_name", required = false) String fileName,
            @RequestParam(name = "file_path", required = false) String filePath,
            @RequestParam(name = "series_description", required = false) String seriesDescription,
            @RequestParam(name = "note_text", required = false) String noteText,
            @RequestParam(name = "image_position_x_min", required = false) BigDecimal imagePositionXMin,
            @RequestParam(name = "image_position_x_max", required = false) BigDecimal imagePositionXMax,
            @RequestParam(name = "image_position_y_min", required = false) BigDecimal imagePositionYMin,
            @RequestParam(name = "image_position_y_max", required = false) BigDecimal imagePositionYMax,
            @RequestParam(name = "image_position_z_min", required = false) BigDecimal imagePositionZMin,
            @RequestParam(name = "image_position_z_max", required = false) BigDecimal imagePositionZMax
    ) {

        PatientSearchRequest request = PatientSearchRequest.builder()
                .patientId(patientId)
                .patientSex(patientSex)
                .patientSizeM(patientSizeM)
                .patientAge(patientAge)
                .patientWeight(patientWeight)
                .fileId(fileId)
                .previewPngBase64(previewPngBase64)
                .fileName(fileName)
                .filePath(filePath)
                .seriesDescription(seriesDescription)
                .noteText(noteText)
                .imagePositionXMin(imagePositionXMin)
                .imagePositionXMax(imagePositionXMax)
                .imagePositionYMin(imagePositionYMin)
                .imagePositionYMax(imagePositionYMax)
                .imagePositionZMin(imagePositionZMin)
                .imagePositionZMax(imagePositionZMax)
                .build();

        List<PatientSearchResult> results = patientSearchService.searchPatients(request);

        ApiResponse<List<PatientSearchResult>> apiResponse = ApiResponse.<List<PatientSearchResult>>builder()
                .code("200")
                .message("success")
                .entity(results)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
