package com.example.backend.service;

import com.example.backend.dto.GoogleBookDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GoogleBooksService {
    private final RestTemplate restTemplate;
    
    @Value("${google.books.api.url}")
    private String apiUrl;
    @Value("${google.books.api.key}")
    private String apiKey;
    private static final int MAX_RESULTS = 10;
    private final Logger logger = LoggerFactory.getLogger(GoogleBooksService.class);

    public GoogleBooksService() {
        this.restTemplate = new RestTemplate();
    }

    public GoogleBookDTO[] searchBooks(String query) throws RuntimeException {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("q", query)
                    .queryParam("maxResults", MAX_RESULTS)
                    .queryParam("printType", "books")
                    .queryParam("key", apiKey)
                    .build()
                    .toUriString();

            logger.info("Searching books with query: {}", query);
            logger.debug("Request URL: {}", url);

            var response = restTemplate.getForObject(url, GoogleBooksApiResponse.class);
            
            if (response == null || response.getItems() == null) {
                logger.warn("No results found for query: {}", query);
                return new GoogleBookDTO[0];
            }
            
            logger.info("Found {} results for query: {}", 
                response.getItems().length, query);
            return response.getItems();
        } catch (Exception e) {
            logger.error("Error searching books: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to search books", e);
        }
    }

    private static class GoogleBooksApiResponse {
        private GoogleBookDTO[] items;
        public GoogleBookDTO[] getItems() { return items; }
        public void setItems(GoogleBookDTO[] items) { this.items = items; }
    }
}
