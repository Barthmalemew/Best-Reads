package com.example.backend.controller;

import com.example.backend.model.Collection;
import com.example.backend.service.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection")
public class CollectionController {

     private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public List<Collection> getAllCollection() {
        return collectionService.getAllCollections();
    }


}
