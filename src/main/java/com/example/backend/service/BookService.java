package com.example.backend.service;

import com.example.backend.model.Book;
import com.example.backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service  // Marks this class as a Spring service, which holds the business logic
public class BookService {

    private final BookRepository bookRepository;

    // Constructor-based dependency injection for BookRepository
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Method to add a new book to the repository (database)
    public Book addBook(Book book) {
        return bookRepository.save(book);  // Saves the book entity and returns the saved object
    }

    // Method to retrieve all books from the repository (database)
    public List<Book> getAllBooks() {
        return bookRepository.findAll();  // Returns a list of all book entities in the database
    }
}
