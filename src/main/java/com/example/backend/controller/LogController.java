package com.example.backend.controller;

import com.example.backend.model.Log;
import com.example.backend.service.LogService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/log")
public class LogController {
    
    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @PostMapping
    public Log saveLog(Log log){
       return logService.save(log);
    }

    @GetMapping("/totalPages")
    public ResponseEntity<Integer> getTotalPages() {
        Integer totalPages = logService.getTotalPages();
        return ResponseEntity.ok(totalPages != null ? totalPages : 0);
    }
}
