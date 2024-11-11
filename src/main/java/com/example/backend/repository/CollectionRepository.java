package com.example.backend.repository;

import com.example.backend.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

// Interface to handle database operations for the Book entity
// JpaRepository provides basic CRUD operations without the need for implementation
public interface CollectionRepository extends JpaRepository<Collection, Long> {
}

