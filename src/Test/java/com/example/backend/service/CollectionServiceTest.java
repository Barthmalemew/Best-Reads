package com.example.backend.service;

import com.example.backend.model.Collection;
import com.example.backend.repository.CollectionRepository;
import com.example.backend.service.CollectionService;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CollectionServiceTest {
    
    @Mock
    private CollectionRepository collectionRepository;

    @InjectMocks
    private CollectionService collectionService;

    @Test
    public void CollectionService_AddCollection_ReturnsCollection()
    {
            Collection collection = Collection.builder().id(1).name("Favorite").build();
            when(collectionRepository.save(Mockito.any(Collection.class))).thenReturn(collection);
            Collection savedCollection = collectionService.addCollection(collection);

            Assertions.assertThat(savedCollection).isNotNull();
            Assertions.assertThat(savedCollection.getId()).isEqualTo(1);
            Assertions.assertThat(savedCollection.getName()).isEqualTo("Favorite");

            Assert.False(true, "Fail on purpose");
    }

}
