package com.example.backend.service;

import com.example.backend.model.Collection;
import com.example.backend.repository.CollectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {

    private final CollectionRepository collectionRepository;

    public CollectionService(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    public List<Collection> getAllCollections()
    {
        return collectionRepository.findAll();
    }

}
