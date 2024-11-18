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

    public Collection addCollection(Collection collection)
    {
        return collectionRepository.save(collection);
    }

    public boolean deleteCollection(Long id) {
        if (collectionRepository.existsById(id)) {
            collectionRepository.deleteById(id);
            return true;
        }
        return false;
    }


}
