package com.vn.Medical.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class HistoryChatRequest {
     Long doctorId;
     Long patientId;
     JsonNode data;

}
