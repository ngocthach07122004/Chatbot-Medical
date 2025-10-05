package com.vn.Medical.controller;

import com.vn.Medical.dto.request.PprRequest;
import com.vn.Medical.entity.PprDocument;
import com.vn.Medical.service.PprDocumentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ppr")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PprDocumentController {
    PprDocumentService pprDocumentService;
    @GetMapping("/relevent")
    public List<PprDocument> getPprDocumment (@RequestBody PprRequest pprRequest) {
        return pprDocumentService.getPprDocuments(pprRequest);
    }
}
