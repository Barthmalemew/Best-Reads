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
        console.error('Error fetching totalPages:', error);
        document.getElementById('totalPages').innerText = `Error fetching total pages. Please try again later.`;
    }
}

function initialize () {
    fetchBooks();
    fetchTotalPages();
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
const colForm = document.querySelectorAll("form")[0];
const pageForm = document.querySelectorAll("form")[1];
const AddForm = document.querySelectorAll("form")[2];


openBtnAdd.addEventListener("click", () =>{
    dialogAdd.showModal();
});

closeBtnAdd.addEventListener("click", () => {
    
    AddForm.reset();
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