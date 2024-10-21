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
                <div class="img-edit-btn">
                    <img src="${book.image_url ? book.image_url : 'https://covers.openlibrary.org/b/id/8236211-L.jpg'}" alt="Book cover">
                    <button class="btn">Edit</button>
                </div>

                <div class="details">
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Rating:</strong> ${book.rating}/5</p>
                    <div class="status">Completed</div>
                </div>

                <p class="bio"><strong>Bio:</strong> <br> ${book.bio}</p>

            `;

            bookList.appendChild(bookItem);
        });

    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

window.onload = fetchBooks;

const openBtnCol = document.querySelectorAll(".sidebar p")[2];
const openBtnAdd = document.querySelectorAll(".sidebar p")[0];
const dialogCol = document.getElementsByClassName("dialog")[0];
const dialogAdd = document.getElementsByClassName("dialog")[1];
const closeBtnCol = document.getElementsByClassName("close-btn")[0];
const closeBtnAdd = document.getElementsByClassName("close-btn")[1];
const colForm = document.querySelectorAll("form")[0]
const AddForm = document.querySelectorAll("form")[1]


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
