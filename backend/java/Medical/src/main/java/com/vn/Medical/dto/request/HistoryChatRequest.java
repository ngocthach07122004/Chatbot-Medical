package com.vn.Medical.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Type;

@Builder
@Data
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class HistoryChatRequest {
     Long doctorId;
     Long patientId;
    @Column(name = "data", columnDefinition = "jsonb")
    @Type(JsonType.class)
     JsonNode data;

}

