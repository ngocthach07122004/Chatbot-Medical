package com.vn.Medical.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.Medical.dto.request.HistoryChatRequest;
import com.vn.Medical.dto.response.DoctorPatientChatDTO;
import com.vn.Medical.entity.DoctorPatientChat;
import com.vn.Medical.entity.HistoryChat;
import com.vn.Medical.repository.DoctorPatientChatRepository;
import com.vn.Medical.repository.HistoryChatRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HistoryChatService {
     HistoryChatRepository historyChatRepository ;
     DoctorPatientChatService doctorPatientChatService;
     ObjectMapper objectMapper;
     DoctorPatientChatRepository doctorPatientChatRepository;
     KafkaTemplate<Long, DoctorPatientChatDTO> kafkaTemplate;

    public HistoryChat createHistoryChat (HistoryChatRequest request) {
        HistoryChat historyChat = new HistoryChat();
        historyChat.setData(request.getData());
        historyChat.setCreatedAt(LocalDateTime.now());
        historyChatRepository.save(historyChat);
        DoctorPatientChat doctorPatientChat = new DoctorPatientChat();
        doctorPatientChat.setDoctorId(request.getDoctorId());
        doctorPatientChat.setHistoryChatId(historyChat.getId());
        doctorPatientChat.setPatientId(request.getPatientId());
        doctorPatientChat.setTime(LocalDate.now());
        doctorPatientChatRepository.save(doctorPatientChat);
        DoctorPatientChatDTO doctorPatientChatDTO = DoctorPatientChatDTO.builder()
                .doctorId(doctorPatientChat.getDoctorId())
                .historyChatId(doctorPatientChat.getHistoryChatId())
                .patientId(doctorPatientChat.getPatientId())
                .build();
        kafkaTemplate.send("HistoryChatTopic",doctorPatientChatDTO);
        return historyChat;

    }
    public Map<LocalDate,List<HistoryChat>> getHistoryChat (Long doctorId, Long patientId) {
        List<Object[]> hictoryChats = doctorPatientChatService.getHistoryChatIdByDoctorAndPatient(doctorId,patientId);
        Map<LocalDate,List<HistoryChat>> hictoryChatResult = new HashMap<>();
        if(hictoryChats.isEmpty()) {
            return hictoryChatResult;
        }
        Map<LocalDate,List<Long>> hictoryChatMap = new HashMap<>();
//        for (Object[] row : hictoryChats) {
//            hictoryChatMap.computeIfAbsent( (LocalDate) row[0], k -> new ArrayList<>()).add((Long)row[1]);
//        }
        for (Object[] row : hictoryChats) {
//            Timestamp ts = (Timestamp) row[0];  // hoặc Date tùy vào DB
//            LocalDate date = ts.toLocalDateTime().toLocalDate();
//
//            hictoryChatMap
//                    .computeIfAbsent(date, k -> new ArrayList<>())
//                    .add(((Number) row[1]).longValue());
            Object timeObj = row[0];
            LocalDate date;

            if (timeObj instanceof java.sql.Timestamp ts) {
                date = ts.toLocalDateTime().toLocalDate();
            } else if (timeObj instanceof java.sql.Date d) {
                date = d.toLocalDate();
            } else {
                throw new IllegalStateException("Unknown date type: " + timeObj.getClass());
            }

            Long chatId = ((Number) row[1]).longValue();

            hictoryChatMap
                    .computeIfAbsent(date, k -> new ArrayList<>())
                    .add(chatId);

        }
        hictoryChatMap.forEach( (date,hictoryChatIds ) -> {
            List<HistoryChat> historyChatsRepsonse = historyChatRepository.getHistoryChatByIds(hictoryChatIds);
            hictoryChatResult.put(date,historyChatsRepsonse);
        } );
        return  new TreeMap<>(hictoryChatResult);

    }
}
