package com.vn.Medical.repository;

import com.vn.Medical.entity.HistoryChat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryChatRepository extends JpaRepository<HistoryChat,Long> {

    @Query(value = "SELECT hc FROM HistoryChat as hc WHERE hc.id in (:ids) ORDER BY hc.createdAt ASC")
     List<HistoryChat> getHistoryChatByIds (@Param("ids") List<Long> ids);
}
