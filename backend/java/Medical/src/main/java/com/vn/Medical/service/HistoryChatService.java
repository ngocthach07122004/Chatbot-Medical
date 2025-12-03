package com.vn.Medical.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vn.Medical.dto.request.HistoryChatRequest;
import com.vn.Medical.dto.response.DoctorPatientChatDTO;
import com.vn.Medical.entity.DoctorPatientChat;
import com.vn.Medical.entity.HistoryChat;
import com.vn.Medical.repository.DoctorPatientChatRepository;
import com.vn.Medical.repository.HistoryChatRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
    RestTemplate restTemplate;

    @NonFinal
    @Value("${kafkaEnv.topic}")
    private String topicName;

    @NonFinal
    @Value("${openai.api-key}")
    String openaiApiKey;

    @Transactional
    public HistoryChat createHistoryChat(HistoryChatRequest request) {

        // get user question from request JSON
        // { "data": { "question": "test test test cau hoi?" } }
        String userQuestion = "";
        if (request.getData().has("question")) {
            userQuestion = request.getData().get("question").asText();
        } else {
            // falllback
            userQuestion = request.getData().toString();
        }

        // get bot answer from OpenAI
        String botAnswer = callOpenAI(userQuestion);

        // create conversation JSON
        ObjectNode conversationData = objectMapper.createObjectNode();
        conversationData.put("user_question", userQuestion);
        conversationData.put("bot_answer", botAnswer);
        conversationData.put("timestamp", LocalDateTime.now().toString());

        // save DB HistoryChat
        HistoryChat historyChat = new HistoryChat();
        historyChat.setData(conversationData); // Lưu cục JSON mới
        historyChat.setCreatedAt(LocalDateTime.now());
        historyChatRepository.save(historyChat);

        // save db DoctorPatientChat
        DoctorPatientChat doctorPatientChat = new DoctorPatientChat();
        doctorPatientChat.setDoctorId(request.getDoctorId());
        doctorPatientChat.setHistoryChatId(historyChat.getId());
        doctorPatientChat.setPatientId(request.getPatientId());
        doctorPatientChat.setTime(LocalDate.now());
        doctorPatientChatRepository.save(doctorPatientChat);

        // send kafka
        try {
            DoctorPatientChatDTO dto = DoctorPatientChatDTO.builder()
                    .doctorId(doctorPatientChat.getDoctorId())
                    .historyChatId(doctorPatientChat.getHistoryChatId())
                    .patientId(doctorPatientChat.getPatientId())
                    .build();
            kafkaTemplate.send(topicName, dto);
        } catch (Exception e) {
            System.err.println("Lỗi gửi Kafka: " + e.getMessage());
        }

        return historyChat;
    }

    private String callOpenAI(String question) {
        String url = "https://api.openai.com/v1/chat/completions";

        // Tạo Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        // Tạo Body request theo đúng chuẩn OpenAI
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "Bạn là một trợ lý y tế hữu ích. Hãy trả lời ngắn gọn."),
                Map.of("role", "user", "content", question)
        ));
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Bắn Request POST
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(url, entity, JsonNode.class);

            // Parse kết quả trả về để lấy nội dung text
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody()
                        .get("choices")
                        .get(0)
                        .get("message")
                        .get("content")
                        .asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gọi AI: " + e.getMessage();
        }
        return "Không có phản hồi từ AI";
    }

//    public HistoryChat createHistoryChat (HistoryChatRequest request) {
//        HistoryChat historyChat = new HistoryChat();
//        historyChat.setData(request.getData());
//        historyChat.setCreatedAt(LocalDateTime.now());
//        historyChatRepository.save(historyChat);
//        DoctorPatientChat doctorPatientChat = new DoctorPatientChat();
//        doctorPatientChat.setDoctorId(request.getDoctorId());
//        doctorPatientChat.setHistoryChatId(historyChat.getId());
//        doctorPatientChat.setPatientId(request.getPatientId());
//        doctorPatientChat.setTime(LocalDate.now());
//        doctorPatientChatRepository.save(doctorPatientChat);
//        DoctorPatientChatDTO doctorPatientChatDTO = DoctorPatientChatDTO.builder()
//                .doctorId(doctorPatientChat.getDoctorId())
//                .historyChatId(doctorPatientChat.getHistoryChatId())
//                .patientId(doctorPatientChat.getPatientId())
//                .build();
//        kafkaTemplate.send("HistoryChatTopic",doctorPatientChatDTO);
//        return historyChat;
//
//    }
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
