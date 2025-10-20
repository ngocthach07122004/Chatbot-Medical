package com.vn.Medical.controller;

import com.vn.Medical.dto.request.HistoryChatRequest;
import com.vn.Medical.dto.response.ApiResponse;
import com.vn.Medical.entity.HistoryChat;
import com.vn.Medical.service.HistoryChatService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/historyChat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HistoryChatController {
   HistoryChatService historyChatService;
    @GetMapping("/{doctorId}/{patientId}")
    public Map<LocalDate, List<HistoryChat>> getHistoryChatsByDoctorIdAndPatientId(
            @PathVariable(name = "doctorId") Long doctorId,
            @PathVariable(name = "patientId") Long patientId  )
    {
        return historyChatService.getHistoryChat(doctorId,patientId);
    }

    @PostMapping("/create")
    public ApiResponse<HistoryChat> createHistoryChat(@RequestBody HistoryChatRequest request){
         return ApiResponse.<HistoryChat>builder().code("200").message("success").entity(historyChatService.createHistoryChat(request)).build();
    }
}

