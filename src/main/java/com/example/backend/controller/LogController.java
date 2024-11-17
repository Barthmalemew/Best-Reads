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
    public ResponseEntity<Log> saveLog(@RequestBody Log log) {
        if (log.getPagesRead() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        
        Log savedLog = logService.save(log);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/totalPages")
    public ResponseEntity<Integer> getTotalPages() {
        Integer totalPages = logService.getTotalPages();
        return ResponseEntity.ok(totalPages != null ? totalPages : 0);
    }
    
    @GetMapping("/averagePages")
    public ResponseEntity<Double> getAveragePages() {
        Double averagePages = logService.getAveragePages();
        return ResponseEntity.ok(averagePages);
    }

    @GetMapping("/monthlyPages")
    public ResponseEntity<Integer> getTotalPagesPast30Days() {
        Integer pastMonthsPages = logService.getTotalPagesPast30Days();
        return ResponseEntity.ok(pastMonthsPages != null ? pastMonthsPages : 0);
    }
}
