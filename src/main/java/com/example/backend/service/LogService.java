package com.example.backend.service;

import com.example.backend.model.Log;
import com.example.backend.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    private final LogRepository logRepository;

    public LogService (LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public List<Log> getAllLogs () {
        return logRepository.findAll();
    }

    public Log save(Log log) {
        return logRepository.save(log);
    }

    public Integer getTotalPages() {
        return logRepository.getTotalPages();
    }
    
    public Double getAveragePages() {
        Integer totalPages = getTotalPages();
        Long logCount = logRepository.getLogCount();
        
        if (totalPages == null || logCount == null || logCount == 0) {
            return 0.0;
        }
        
        return Math.round((double) totalPages / logCount * 100.0) / 100.0;
    }

    public Integer getTotalPagesPast30Days() {
        return logRepository.getTotalPagesPast30Days();
    }
}
