package com.example.backend.service;

import com.example.backend.model.Log;
import com.example.backend.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    private final LogRepository LogRepository;

    public LogService (LogRepository LogRepository) {
        this.LogRepository = LogRepository;
    }

    public List<Log> getAllLogs () {
        return LogRepository.findAll();
    }

    public Log save(Log log) {
        return LogRepository.save(log);
    }

    public Integer getTotalPages() {
        return LogRepository.getTotalPages();
    }

}