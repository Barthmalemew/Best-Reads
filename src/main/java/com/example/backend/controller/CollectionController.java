package com.example.backend.controller;

import com.example.backend.model.Book;
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

    @PostMapping
    public ResponseEntity<Collection> addCollection(@RequestBody Collection collection) {
            try{
               Collection colSaved = collectionService.addCollection(collection); 
               return ResponseEntity.ok(colSaved);
            }
            catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
    }


}
