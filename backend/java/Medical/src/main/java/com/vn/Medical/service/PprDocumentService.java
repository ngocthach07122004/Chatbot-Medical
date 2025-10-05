package com.vn.Medical.service;

import com.vn.Medical.dto.request.PprRequest;
import com.vn.Medical.entity.PprDocument;
import com.vn.Medical.repository.PprDocumentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level =  AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class PprDocumentService {
    PprDocumentRepository pprDocumentRepository;
    public List<PprDocument> getPprDocuments (PprRequest pprRequest) {
         return pprDocumentRepository.findAllById(pprRequest.getListId());
    }

}
