package com.vn.Medical.exception;

import com.vn.Medical.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlerAppException (AppException appException ){
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(appException.getErrorCode().getCode())
                .message(appException.getErrorCode().getMessage())
                .build();
         return ResponseEntity.badRequest().body(apiResponse);
    }

}
