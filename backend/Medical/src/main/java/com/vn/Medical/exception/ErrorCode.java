package com.vn.Medical.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

         UNAUTHENTICATED("404","wrong information, please check again"),
         EMAIL_NOT_EXIST("400","please check your email"),
    EMAIL_ALREADY_EXIST("400","email already exist, please chose another email");
     private ErrorCode (String code , String message ) {
              this.code= code;
              this.message= message;
     }

    public String getMessage() {
        return message;
    }

    public String getCode() {
        return code;
    }

    private final String code;
        private final String message;
}
