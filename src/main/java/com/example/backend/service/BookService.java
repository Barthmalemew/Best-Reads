package com.example.backend.service;

import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
    
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book addBook(Book book) {
        logger.info("Attempting to save book: {}", book);
        try {
            // Validate book data
            if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
                throw new IllegalArgumentException("Book title cannot be empty");
            }
            if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
                throw new IllegalArgumentException("Book author cannot be empty");
            }

            // Set default values for optional fields
            if (book.getStatus() == null) book.setStatus("Not Started");
            if (book.getGenre() == null) book.setGenre("Uncategorized");
            if (book.getSynopsis() == null) book.setSynopsis("No synopsis available");

            Book savedBook = bookRepository.save(book);
            logger.info("Successfully saved book with ID: {}", savedBook.getId());
            return savedBook;
        } catch (Exception e) {
            logger.error("Failed to save book: ", e);
            throw new RuntimeException("Failed to save book: " + e.getMessage(), e);
        }
    }

    public boolean existsById(Long id) {
        return bookRepository.existsById(id);
    }

    public Book updateBook(Book book) {
        return bookRepository.save(book);
    }

    public boolean deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public String getFavoriteGenre() {
        List<Book> books = getAllBooks();
        if (books.isEmpty()) {
            return "No books available";
        }

        Map<String, Long> genreCounts = books.stream()
            .filter(book -> book.getGenre() != null && !book.getGenre().trim().isEmpty())
            .collect(Collectors.groupingBy(
                Book::getGenre,
                Collectors.counting()
            ));

        if (genreCounts.isEmpty()) {
            return "No genres found";
        }

        return genreCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Unknown");
    }
}
