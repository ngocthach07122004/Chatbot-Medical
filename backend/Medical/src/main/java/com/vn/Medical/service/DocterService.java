package com.vn.Medical.service;

import com.vn.Medical.dto.request.DocterLogin;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.entity.Docter;
import com.vn.Medical.exception.AppException;
import com.vn.Medical.exception.ErrorCode;
import com.vn.Medical.mapper.DocterMapper;
import com.vn.Medical.repository.DocterRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.query.NativeQuery;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocterService {
    DocterRepository docterRepository;
    PasswordEncoder passwordEncoder;
    DocterMapper docterMapper;
    public Docter createDocter(DocterLogin docterRequest ) {
        Optional<Docter> docter = docterRepository.findByGmail(docterRequest.getGmail());
        if(!docter.isPresent()){
            Docter newDocter = docterMapper.fromDocterRequestToDoctor(docterRequest);
            newDocter.setPassword(passwordEncoder.encode(docterRequest.getPassword()));
            return docterRepository.save(newDocter);
        }
        else {
                throw new AppException(ErrorCode.EMAIL_ALREADY_EXIST);
        }
    }
    private Docter findDocter (String gmail) {
       return  docterRepository.findByGmail(gmail).orElseThrow(
                () -> new AppException(ErrorCode.EMAIL_NOT_EXIST)
        );

    }
    public ApiResponse<Docter>  authentication (DocterLogin docterLogin) {
         Docter docter = docterRepository.findByGmail(docterLogin.getGmail()).orElseThrow(
                 () -> new AppException(ErrorCode.EMAIL_NOT_EXIST)
         );
         boolean isAuthen = passwordEncoder.matches(docterLogin.getPassword(),docter.getPassword());
         if(isAuthen) {
             return ApiResponse.<Docter>builder().code("200").message("sucess").entity(docter).build();
         }
         else {
             return ApiResponse.<Docter>builder().code("404").message("fail").build();
         }
    }
    public String updateDocter (String gmail, Docter docterUpdater ){
        Docter docter = this.findDocter(gmail);
        docterMapper.updateDocter(docter, docterUpdater);
        docterRepository.save(docter);
        return "success";
    }

}
