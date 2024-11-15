package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.backend.model.Book;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBookDTO {
    private static final Logger logger = LoggerFactory.getLogger(GoogleBookDTO.class);
    private String id;
    private VolumeInfo volumeInfo;
    
    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public VolumeInfo getVolumeInfo() {
        return volumeInfo;
    }

    public void setVolumeInfo(VolumeInfo volumeInfo) {
        this.volumeInfo = volumeInfo;
    }

    public Book toBook() {
        Book book = new Book();
        if (this.volumeInfo != null) {
            logger.debug("Converting GoogleBookDTO to Book. Title: {}", this.volumeInfo.getTitle());
            
            // Set required fields with strict validation
            String title = this.volumeInfo.getTitle();
            if (title == null || title.trim().isEmpty()) {
                throw new IllegalArgumentException("Book title cannot be empty");
            }
            book.setTitle(title.trim());
            
            String[] authors = this.volumeInfo.getAuthors();
            if (authors == null || authors.length == 0) {
                throw new IllegalArgumentException("Book must have at least one author");
            }
            book.setAuthor(String.join(", ", authors).trim());
            
            // Set optional fields with proper null checks
            book.setGenre(this.volumeInfo.getCategories() != null ? 
                String.join(", ", this.volumeInfo.getCategories()) : "Uncategorized");
            // Handle synopsis with proper truncation if needed
            String description = this.volumeInfo.getDescription();
            if (description != null) {
                description = description.trim();
                book.setSynopsis(description);
            } else {
                book.setSynopsis("No description available");
            }
            
            // Set default status and rating
            book.setRating(0.0);
            book.setStatus("Not Started");
            book.setImage_url(this.volumeInfo.getImageLinks() != null ? 
                this.volumeInfo.getImageLinks().getThumbnail() : null);
        }
        return book;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        private String title;
        private String[] authors;
        private String description;
        private ImageLinks imageLinks;
        private String[] categories;
        private String publishedDate;
        
        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String[] getAuthors() {
            return authors;
        }

        public void setAuthors(String[] authors) {
            this.authors = authors;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public ImageLinks getImageLinks() {
            return imageLinks;
        }

        public void setImageLinks(ImageLinks imageLinks) {
            this.imageLinks = imageLinks;
        }

        public String[] getCategories() {
            return categories;
        }

        public void setCategories(String[] categories) {
            this.categories = categories;
        }

        public String getPublishedDate() {
            return publishedDate;
        }

        public void setPublishedDate(String publishedDate) {
            this.publishedDate = publishedDate;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        private String thumbnail;
        private String smallThumbnail;
        
        // Getters and Setters
        public String getThumbnail() {
            return thumbnail;
        }

        public void setThumbnail(String thumbnail) {
            this.thumbnail = thumbnail;
        }

        public String getSmallThumbnail() {
            return smallThumbnail;
        }

        public void setSmallThumbnail(String smallThumbnail) {
            this.smallThumbnail = smallThumbnail;
        }
    }
}
