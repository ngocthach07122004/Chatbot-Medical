package com.vn.Medical.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vn.Medical.entity.HistoryChat;
import com.vn.Medical.repository.HistoryChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HistoryChatService {
    private final HistoryChatRepository historyChatRepository ;
    private final DoctorPatientChatService doctorPatientChatService;
    private final ObjectMapper objectMapper;

    public HistoryChat saveHistoryChat (String jsonString ) {
         try {
             JsonNode node = objectMapper.readTree(jsonString);
             HistoryChat historyChat = new HistoryChat();
             historyChat.setData(node);
             return historyChatRepository.save(historyChat);
         }
         catch (Exception e) {
             throw new RuntimeException(e);
         }
    }
    public Map<LocalDate,List<HistoryChat>> getHistoryChat (String doctorId, Long patientId) {
        List<Object[]> hictoryChats = doctorPatientChatService.getHistoryChatIdByDoctorAndPatient(doctorId,patientId);
        Map<LocalDate,List<HistoryChat>> hictoryChatResult = new HashMap<>();
        if(hictoryChats.isEmpty()) {
            return hictoryChatResult;
        }
        Map<LocalDate,List<Long>> hictoryChatMap = new HashMap<>();
        for (Object[] row : hictoryChats) {
            hictoryChatMap.computeIfAbsent( (LocalDate) row[0], k -> new ArrayList<>()).add((Long)row[1]);
        }
        hictoryChatMap.forEach( (date,hictoryChatIds ) -> {
            List<HistoryChat> historyChatsRepsonse = historyChatRepository.getHistoryChatByIds(hictoryChatIds);
            hictoryChatResult.put(date,historyChatsRepsonse);
        } );
        return  new TreeMap<>(hictoryChatResult);

    }
}
