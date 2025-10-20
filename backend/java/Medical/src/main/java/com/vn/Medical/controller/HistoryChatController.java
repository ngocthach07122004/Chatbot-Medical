package com.vn.Medical.controller;

import com.vn.Medical.entity.HistoryChat;
import com.vn.Medical.service.HistoryChatService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
