package com.vn.Medical.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {
    String code;
    String message;
    T entity;
    public ApiResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
