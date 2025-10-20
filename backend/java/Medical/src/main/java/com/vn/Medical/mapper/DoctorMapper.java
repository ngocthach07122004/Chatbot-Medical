package com.vn.Medical.mapper;

import com.vn.Medical.dto.request.DoctorLogin;
import com.vn.Medical.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    @Mapping(target = "password",ignore = true)
    @Mapping(target = "id", ignore = true)
    Doctor toDoctor(Doctor Doctor);

    @Mapping(target = "password",ignore = true)
    Doctor fromDoctorRequestToDoctor(DoctorLogin DoctorLogin);
    void updateDoctor(@MappingTarget Doctor Doctor, Doctor DoctorUpdate);
}
