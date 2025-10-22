package com.vn.Medical.controller;

import com.vn.Medical.dto.request.DoctorLogin;
import com.vn.Medical.dto.request.DoctorSignup;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.entity.Doctor;
import com.vn.Medical.repository.DoctorRepository;
import com.vn.Medical.service.DoctorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/doctor")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DoctorController {
    DoctorService DoctorService;
    @PostMapping("/auth/register")
    public ApiResponse<Doctor> createAccount (@RequestBody DoctorSignup Doctor ) {
          return ApiResponse.<Doctor>builder().code("200").message("success").entity(DoctorService.createAccount(Doctor)).build();
    }
    @PostMapping("/auth/login")
    public ApiResponse<Doctor> authentication (@RequestBody DoctorLogin DoctorLogin ){
        return DoctorService.authentication(DoctorLogin);
    }
    @PostMapping("/update/{gmail}")
    public String updateDoctor (@PathVariable String gmail, @RequestBody Doctor Doctor ){

        return DoctorService.updateDoctor(gmail,Doctor);
    }
    @GetMapping("/get/{gmail}")
    public Doctor getDoctorProfile (@PathVariable String gmail) {
         return DoctorService.findDoctor(gmail);
    }

}
