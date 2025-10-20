package com.vn.Medical.service;

import com.vn.Medical.dto.request.DoctorLogin;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.entity.Doctor;
import com.vn.Medical.exception.AppException;
import com.vn.Medical.exception.ErrorCode;
import com.vn.Medical.mapper.DoctorMapper;
import com.vn.Medical.repository.DoctorRepository;
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
public class DoctorService {
    DoctorRepository DoctorRepository;
    PasswordEncoder passwordEncoder;
    DoctorMapper DoctorMapper;
    public Doctor createDoctor(DoctorLogin DoctorRequest ) {
        Optional<Doctor> Doctor = DoctorRepository.findByGmail(DoctorRequest.getGmail());
        if(!Doctor.isPresent()){
            Doctor newDoctor = DoctorMapper.fromDoctorRequestToDoctor(DoctorRequest);
            newDoctor.setPassword(passwordEncoder.encode(DoctorRequest.getPassword()));
            return DoctorRepository.save(newDoctor);
        }
        else {
                throw new AppException(ErrorCode.EMAIL_ALREADY_EXIST);
        }
    }
    private Doctor findDoctor (String gmail) {
       return  DoctorRepository.findByGmail(gmail).orElseThrow(
                () -> new AppException(ErrorCode.EMAIL_NOT_EXIST)
        );

    }
    public ApiResponse<Doctor>  authentication (DoctorLogin DoctorLogin) {
         Doctor Doctor = DoctorRepository.findByGmail(DoctorLogin.getGmail()).orElseThrow(
                 () -> new AppException(ErrorCode.EMAIL_NOT_EXIST)
         );
         boolean isAuthen = passwordEncoder.matches(DoctorLogin.getPassword(),Doctor.getPassword());
         if(isAuthen) {
             return ApiResponse.<Doctor>builder().code("200").message("sucess").entity(Doctor).build();
         }
         else {
             return ApiResponse.<Doctor>builder().code("404").message("fail").build();
         }
    }
    public String updateDoctor (String gmail, Doctor DoctorUpdater ){
        Doctor Doctor = this.findDoctor(gmail);
        DoctorMapper.updateDoctor(Doctor, DoctorUpdater);
        DoctorRepository.save(Doctor);
        return "success";
    }

}
