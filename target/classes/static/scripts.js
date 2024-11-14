async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();

        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.classList.add('BookCardPop');
            bookItem.dataset.bookId = book.id; // Add data attribute for book ID
            if (book.collection)
            {
             bookItem.dataset.collectionId = book.collection.id;
            }

            bookItem.innerHTML = `
                <div class="img-edit-btn">
                    <img src="${book.image_url ? book.image_url : 'https://covers.openlibrary.org/b/id/8236211-L.jpg'}" alt="Book cover">
                    <button class="btn" onclick="openEditBookDialog(this)">Edit</button>
                    <button class="btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
                </div>

                <div class="details">
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Rating:</strong> ${book.rating}/5</p>
                    <p><strong>Status:</strong> ${book.status}</p>
                </div>

                <p class="synopsis"><strong>Synopsis:</strong> <br> ${book.synopsis}</p>

            `;

            bookList.appendChild(bookItem);
        });

    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

async function fetchCollections(){
    try{
        const response = await fetch('api/collection');
        const collections = await response.json();

        const collectionList = document.getElementById("collectionList");
        const collectionDrop1 = document.getElementsByClassName("col-drop")[0];
        const collectionDrop2 = document.getElementsByClassName("col-drop")[1];


        collectionList.innerHTML = '';
        collectionDrop1.innerHTML = "<option value = '0'> </option>";
        collectionDrop2.innerHTML = "<option value = '0'></option>"

        collections.forEach(collection => {
            const collectionItem = document.createElement('p');
            const collectionOpt1 = document.createElement('option');
            const collectionOpt2 = document.createElement('option');


            collectionOpt1.value = collection.id;
            collectionOpt1.innerHTML = `${collection.name}`;
            collectionOpt2.value = collection.id + " " + collection.name;
            collectionOpt2.innerHTML = `${collection.name}`;

            collectionItem.innerHTML = `${collection.name}`;
            collectionItem.dataset.collectionId = collection.id;
            collectionItem.onclick = function() {searchCollection(collection.id)};

            collectionList.appendChild(collectionItem);
            collectionDrop1.appendChild(collectionOpt1);
            collectionDrop2.appendChild(collectionOpt2);

        });



    }
    catch (error)
    {
        console.error('Error fetching collections:', error);
    }
}

async function fetchTotalPages() {
    try {
        const response = await fetch('/api/log/totalPages');
        const data = await response.json();
        document.getElementById('totalPages').innerText = `Total Pages Read: ${data}`;
    } catch (error) {
        console.error('Error fetching total pages:', error);
        document.getElementById('totalPages').innerText = `Error fetching total pages. Please try again later.`;
    }
}

async function fetchAveragePages() {
    try {
        const response = await fetch('/api/log/averagePages');
        const data = await response.json();
        document.getElementById('averagePages').innerText = `Average Pages: ${data}`;
    } catch (error) {
        console.error('Error fetching average pages:', error);
        document.getElementById('averagePages').innerText = `Error fetching average pages`;
    }
}

function initialize () {
    fetchBooks();
    fetchTotalPages();
    fetchAveragePages();
    fetchCollections();
}

async function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const bookList = document.getElementById('bookList');
    const books = Array.from(bookList.getElementsByClassName('book-item'));

    books.forEach(book => {
        const title = book.querySelector('h2').textContent.toLowerCase();
        const author = book.querySelector('.details p:nth-of-type(1)').textContent.toLowerCase();
        const genre = book.querySelector('.details p:nth-of-type(2)').textContent.toLowerCase();

        if (title.includes(searchTerm) || 
            author.includes(searchTerm) || 
            genre.includes(searchTerm)) {
            book.style.display = '';
        } else {
            book.style.display = 'none';
        }
    });
}

async function searchCollection(collectionId) {
    const bookList = document.getElementById('bookList');
    const books = Array.from(bookList.getElementsByClassName('book-item'));

    
    books.forEach(book => {

        if (book.dataset.collectionId == collectionId) {
            book.style.display = '';
        } else {
            book.style.display = 'none';
        }
    });

    
}

async function submitBook(formData) {
    // Validate and clean the data before sending
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        genre: formData.get('genre'),
        rating: formData.get('rating') ? parseFloat(formData.get('rating')) : 0,
        status: formData.get('status'),
        synopsis: formData.get('synopsis') || '',
        collection: formData.get('collection')==0 ? null : formData.get('collection'),
        image_url: formData.get('image') || 'https://covers.openlibrary.org/b/id/8236211-L.jpg'
    };
    
    // Validate required fields
    if (!bookData.title?.trim() || !bookData.author?.trim()) {
        throw new Error('Title and author are required');
    }

    console.log('Processed book data:', bookData);
    
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to add book');
        }
        await fetchBooks();
        showToast('Book added successfully!');
        return true;
    } catch (error) {
        console.error('Error submitting book:', error);
        showToast(error.message, 'error');
        return false;
    }
}

async function submitCollection(formData)
{
    const collectionData = {
        name: formData.get("collection")
    };

    try{
        const response = await fetch('api/collection',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collectionData)
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to add book');
        }

        await fetchBooks();
        await fetchCollections();

        showToast('Collection added successfully!');
        return true;
    } catch (error) {
        console.error('Error submitting collection:', error);
        showToast(error.message, 'error');
        return false;
    }
    
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete book');

        await fetchBooks();
        showToast('Book deleted successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.style.opacity = '1', 100);

    // Hide and remove toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function openEditBookDialog(button) {
    const bookItem = button.closest('.book-item');
    const title = bookItem.querySelector('h2').innerText;
    const author = bookItem.querySelector('.details p:nth-of-type(1)').innerText.replace('Author: ', '');
    const genre = bookItem.querySelector('.details p:nth-of-type(2)').innerText.replace('Genre: ', '');
    const rating = bookItem.querySelector('.details p:nth-of-type(3)').innerText.replace('Rating: ', '').replace('/5', '');
    const status = bookItem.querySelector('.details p:nth-of-type(4)').innerText.replace('Status: ', '');
    const synopsis = bookItem.querySelector('.synopsis').innerText.replace('Synopsis:', '');
    const currentBookId = bookItem.dataset.bookId;
    document.getElementById('edit-book-form').dataset.bookId = currentBookId;

    document.getElementById('edit-title').value = title;
    document.getElementById('edit-author').value = author;
    document.getElementById('edit-genre').value = genre;
    document.getElementById('edit-rating').value = rating;
    document.getElementById('edit-synopsis').value = synopsis;

    if (status === 'Not Started') {
        document.getElementById('edit-status-not-started').checked = true;
    } else if (status === 'In Progress') {
        document.getElementById('edit-status-in-progress').checked = true;
    } else if (status === 'Completed') {
        document.getElementById('edit-status-completed').checked = true;
    }

    document.getElementById('edit-book').showModal();
}

// Add event listener for edit form submission
document.getElementById('edit-book-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookId = event.target.dataset.bookId;
    console.log('Editing book with ID:', bookId);

    const collection = formData.get('collection').split(' ');


    const collectionData = {
        id: collection[0],
        name: collection[1]
    }
    

    const bookData = {
        id: bookId,
        title: formData.get('title'),
        author: formData.get('author'),
        genre: formData.get('genre'),
        rating: parseFloat(formData.get('rating')),
        status: formData.get('status'),
        synopsis: formData.get('synopsis'),
        collection: collectionData.id == 0 ? null: collectionData,
        image_url: formData.get('image') || 'https://covers.openlibrary.org/b/id/8236211-L.jpg'
    };

    console.log('Sending book data:', bookData);

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) throw new Error('Failed to update book');
        
        await fetchBooks();
        document.getElementById('edit-book').close();
        showToast('Book updated successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
});

function openAddBookDialog() {
    document.getElementById('add-book').showModal();
}

function openAddCollectionDialog()
{
    document.getElementById('add-col').showModal();
}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.querySelector('form').reset();
    dialog.close();
}

window.onload = initialize;

const openButtonAdd = document.querySelectorAll(".sidebar p")[0];
const openButtonPage = document.querySelectorAll(".sidebar p")[1];
const openButtonCol = document.querySelectorAll(".sidebar p")[2];

const dialogCol = document.getElementsByClassName("dialog")[0];
const dialogPage = document.getElementsByClassName("dialog")[1];
const dialogAdd = document.getElementsByClassName("dialog")[2];

const closeButtonCol = document.getElementsByClassName("close-btn")[0];
const closeButtonPage = document.getElementsByClassName("close-btn")[1];
const closeButtonAdd = document.getElementsByClassName("close-btn")[2];

const bookForm = document.querySelector('#add-book form');
const pageForm = document.querySelector('#log-pages form'); // Properly declaring the pageForm variable

// Add event listener for book submission
document.querySelector('#add-book form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Validate required fields
    const requiredFields = ['title', 'author', 'genre'];
    for (const field of requiredFields) {
        if (!formData.get(field)?.trim()) {
            showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`, 'error');
            return;
        }
    }
    
    const success = await submitBook(formData);
    
    if (success) {
        document.getElementById('add-book').close();
        event.target.reset();
    }
});

document.querySelector('#add-col form').addEventListener('submit', async (event) =>{
    event.preventDefault();
    const formData = new FormData(event.target);

    const success = await submitCollection(formData);

    if (success) {
        document.getElementById('add-col').close();
        event.target.reset();
    }

});

openButtonAdd.addEventListener("click", () =>{
    dialogAdd.showModal();
});

closeButtonAdd.addEventListener("click", () => {
    bookForm.reset();
    dialogAdd.close();
});

openButtonCol.addEventListener("click", () =>{
    dialogCol.showModal();
});

closeButtonCol.addEventListener("click", () => {
    bookForm.reset();
    dialogCol.close();
});

openButtonPage.addEventListener("click", () =>{
    dialogPage.showModal();
});

closeButtonPage.addEventListener("click", () => {
    pageForm.reset();
    dialogPage.close();
});

// Add event listener for log pages submission
pageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dateValue = formData.get('date'); // Properly formatting the date

    const logData = {
        pagesRead: parseInt(formData.get('pages')),
        dateRead: dateValue.split('-').join('-'), // Ensure proper date format
        minutesRead: 0  // Optional field for now
    };

    try {
        const response = await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        });

        if (!response.ok) throw new Error('Failed to log pages');

        await fetchTotalPages(); // Refresh the total pages display
        await fetchAveragePages(); // Refresh the average pages display
        showToast('Pages logged successfully!');
        dialogPage.close();
    } catch (error) {
        showToast(error.message, 'error');
    }
});
