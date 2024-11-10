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


            bookItem.innerHTML = `
                <div class="img-edit-btn">
                    <img src="${book.image_url ? book.image_url : 'https://covers.openlibrary.org/b/id/8236211-L.jpg'}" alt="Book cover">
                    <button class="btn">Edit</button>
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

function initialize () {
    fetchBooks();
    fetchTotalPages();
}

async function submitBook(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        genre: formData.get('genre'),
        rating: parseFloat(formData.get('rating')),
        status: formData.get('status'),
        synopsis: formData.get('synopsis'),
        image_url: formData.get('image')
    };

    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        showToast('Book added successfully!');
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
    const title = bookItem.querySelector('h3').innerText;
    const author = bookItem.querySelector('p:nth-of-type(1)').innerText.replace('Author: ', '');
    const genre = bookItem.querySelector('p:nth-of-type(2)').innerText.replace('Genre: ', '');
    const rating = bookItem.querySelector('p:nth-of-type(3)').innerText.replace('Rating: ', '');
    const status = bookItem.querySelector('p:nth-of-type(4)').innerText.replace('Status: ', '');
    const synopsis = bookItem.querySelector('p:nth-of-type(5)').innerText.replace('Synopsis: ', '');

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

function openAddBookDialog() {
    document.getElementById('add-book').showModal();
}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.querySelector('form').reset();
    dialog.close();
}

window.onload = initialize;

const openBtnAdd = document.querySelectorAll(".sidebar p")[0];
const openBtnPage = document.querySelectorAll(".sidebar p")[1];
const openBtnCol = document.querySelectorAll(".sidebar p")[2];

const dialogCol = document.getElementsByClassName("dialog")[0];
const dialogPage = document.getElementsByClassName("dialog")[1];
const dialogAdd = document.getElementsByClassName("dialog")[2];

const closeBtnCol = document.getElementsByClassName("close-btn")[0];
const closeBtnPage = document.getElementsByClassName("close-btn")[1];
const closeBtnAdd = document.getElementsByClassName("close-btn")[2];

const bookForm = document.querySelector('#add-book form');
const pageForm = document.querySelector('#log-pages form'); // Properly declaring the pageForm variable

// Add event listener for book submission
bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await submitBook(event);
    document.getElementById('add-book').close();
    await fetchBooks(); // Refresh the book list
    showToast('Book added successfully!');
});

openBtnAdd.addEventListener("click", () =>{
    dialogAdd.showModal();
});

closeBtnAdd.addEventListener("click", () => {

    bookForm.reset();
    dialogAdd.close();
});

openBtnCol.addEventListener("click", () =>{
    dialogCol.showModal();
});

closeBtnCol.addEventListener("click", () => {

    colForm.reset();
    dialogCol.close();
});

openBtnPage.addEventListener("click", () =>{
    dialogPage.showModal();
});

closeBtnPage.addEventListener("click", () => {

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
        showToast('Pages logged successfully!');
        dialogPage.close();
    } catch (error) {
        showToast(error.message, 'error');
    }
});
