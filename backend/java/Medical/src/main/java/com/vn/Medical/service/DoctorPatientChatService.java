package com.vn.Medical.service;

import com.vn.Medical.repository.DoctorPatientChatRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DoctorPatientChatService {
    private final DoctorPatientChatRepository doctorPatientChatRepository;
    public List<Object[]> getHistoryChatIdByDoctorAndPatient (String doctorId, Long patientId) {
         return doctorPatientChatRepository.findHistoryChatsByDoctorAndPatient(doctorId,patientId);
    }
}
