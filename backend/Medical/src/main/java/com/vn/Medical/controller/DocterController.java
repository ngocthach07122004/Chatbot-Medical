package com.vn.Medical.controller;

import com.vn.Medical.dto.request.DocterLogin;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.entity.Docter;
import com.vn.Medical.repository.DocterRepository;
import com.vn.Medical.service.DocterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/docter")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocterController {
    DocterService docterService;
    @PostMapping("/create")
    public ApiResponse<Docter> createDocter (@RequestBody DocterLogin docter ) {
          return ApiResponse.<Docter>builder().code("200").message("success").entity(docterService.createDocter(docter)).build();
    }
    @PostMapping("/auth")
    public ApiResponse<Docter> authentication (@RequestBody DocterLogin docterLogin ){
        return docterService.authentication(docterLogin);
    }
    @PostMapping("/update/{gmail}")
    public String updateDocter (@PathVariable String gmail, @RequestBody Docter docter ){

        return docterService.updateDocter(gmail,docter);
    }
}
