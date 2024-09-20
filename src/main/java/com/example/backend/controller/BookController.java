package com.example.backend.controller;

import com.example.backend.model.Book;
import com.example.backend.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController  // Marks this class as a REST controller to handle HTTP requests and responses
@RequestMapping("/api/books")  // Base URL mapping for all endpoints in this controller
public class BookController {

    private final BookService bookService;

    // Constructor-based dependency injection for BookService
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Endpoint to handle HTTP POST requests for adding a new book
    // The request body is automatically deserialized into a Book object
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);  // Calls the service layer to add the book to the system
    }

    // Endpoint to handle HTTP GET requests for retrieving all books
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();  // Calls the service layer to retrieve all books
    }
}

