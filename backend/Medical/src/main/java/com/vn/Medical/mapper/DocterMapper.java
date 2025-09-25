package com.vn.Medical.mapper;

import com.vn.Medical.dto.request.DocterLogin;
import com.vn.Medical.entity.Docter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DocterMapper {
    @Mapping(target = "password",ignore = true)
    @Mapping(target = "id", ignore = true)
    Docter toDocter(Docter docter);

    @Mapping(target = "password",ignore = true)
    Docter fromDocterRequestToDoctor(DocterLogin docterLogin);
    void updateDocter(@MappingTarget Docter docter, Docter docterUpdate);
}
