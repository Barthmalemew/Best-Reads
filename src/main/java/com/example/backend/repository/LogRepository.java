package com.example.backend.repository;

import com.example.backend.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// Interface to handle database operations for the Log entity
// JpaRepository provides basic CRUD operations without the need for implementation
public interface LogRepository extends JpaRepository<Log, Long> {

    @Query("SELECT SUM(pagesRead) FROM Log log")
    Integer getTotalPages();

    @Query("SELECT COUNT(l) FROM Log l")
    Long getLogCount();

    @Query("SELECT SUM(pagesRead) from Log where dateRead >= CURRENT_DATE - 30")
    Integer getTotalPagesPast30Days();
}
