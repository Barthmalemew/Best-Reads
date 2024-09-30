async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();

        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            bookItem.innerHTML = `
                <img src="${book.image_url ? book.image_url : 'https://covers.openlibrary.org/b/id/8236211-L.jpg'}" alt="Book cover">
                <div class="details">
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Rating:</strong> ${book.rating}/5</p>
                    <p class="bio"><strong>Bio:</strong> ${book.bio}</p>
                </div>
                <div class="status">Completed</div>
                <button class="edit-btn">Edit</button>
            `;

            bookList.appendChild(bookItem);
        });

    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

window.onload = fetchBooks;