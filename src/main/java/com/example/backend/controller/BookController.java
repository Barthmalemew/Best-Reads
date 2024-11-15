package com.example.backend.controller;

import com.example.backend.dto.GoogleBookDTO;
import com.example.backend.dto.ErrorResponse;
import com.example.backend.model.Book;
import com.example.backend.service.BookService;
import com.example.backend.service.GoogleBooksService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final GoogleBooksService googleBooksService;
    private final Logger logger = LoggerFactory.getLogger(BookController.class);

    public BookController(BookService bookService, GoogleBooksService googleBooksService) {
        this.bookService = bookService;
        this.googleBooksService = googleBooksService;
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam String query) {
        try {
            String trimmedQuery = query != null ? query.trim() : "";
            if (trimmedQuery.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Search query cannot be empty"));
            }
            return ResponseEntity.ok(googleBooksService.searchBooks(trimmedQuery));
        } catch (Exception e) {
            logger.error("Error searching books: ", e);
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Error searching books: " + 
                    e.getMessage()));
        }
    }
    
    @PostMapping("/google-book")
    public ResponseEntity<?> addGoogleBook(@RequestBody GoogleBookDTO googleBook) {
        try {
            if (googleBook == null || googleBook.getVolumeInfo() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Invalid book data received"));
            }
            
            logger.info("Attempting to add Google book: {}", googleBook.getVolumeInfo().getTitle());
            Book book = googleBook.toBook();
            logger.debug("Converted GoogleBookDTO to Book: {}", book);
            Book savedBook = bookService.addBook(book);
            logger.info("Successfully added book with ID: {}", savedBook.getId());
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            logger.error("Failed to add Google book: ", e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Failed to add book: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        try {
            // Validate required fields
            if (book.getTitle() == null || book.getTitle().trim().isEmpty() ||
                book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(null);
            }
            
            // Set defaults for optional fields
            if (book.getStatus() == null || book.getStatus().trim().isEmpty()) {
                book.setStatus("Not Started");
            }
            
            // Validate rating range
            if (book.getRating() < 0 || book.getRating() > 5) {
                book.setRating(0);
            }
            
            // Set default image if none provided
            if (book.getImage_url() == null || book.getImage_url().trim().isEmpty()) {
                book.setImage_url("https://covers.openlibrary.org/b/id/8236211-L.jpg");
            }

            Book savedBook = bookService.addBook(book);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        System.out.println("Received update request for book ID: " + id);
        System.out.println("Received book data: " + book);
        
        if (!bookService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        book.setId(id);
        try {
            if (book.getImage_url() == null || book.getImage_url().trim().isEmpty()) {
                book.setImage_url("https://covers.openlibrary.org/b/id/8236211-L.jpg");
            }
            Book updatedBook = bookService.updateBook(book);
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/favorite-genre")
    public ResponseEntity<String> getFavoriteGenre() {
        try {
            String favoriteGenre = bookService.getFavoriteGenre();
            return ResponseEntity.ok(favoriteGenre);
        } catch (Exception e) {
            logger.error("Error getting favorite genre: ", e);
            return ResponseEntity.internalServerError().body("Error getting favorite genre");
        }
    }
}
