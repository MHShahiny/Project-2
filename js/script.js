// Get the UI elements
let form = document.querySelector('#book-form');
let booklist = document.querySelector('#book-list');

// Book class 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class 
class Ui {

    static addBookList(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="delete">X</a></td>`;
        list.appendChild(row); // Append the row to the book list
    }

    static clearFields() {
        document.querySelector('#title').value = ''; // Use .value instead of .Value
        document.querySelector('#author').value = ''; // Use .value instead of .Value
        document.querySelector('#isbn').value = ''; // Use .value instead of .Value
    }

    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(function () {
            div.remove(); // Change to div.remove() instead of document.querySelector('.alert').remove()
        }, 3000);
    }

    static deleteFromBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            Ui.showAlert('Book Removed!', 'success');
        }
    }
}

// Local storage class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static displayBooks() {
        let books = Store.getBooks();
        books.forEach(book => {
            Ui.addBookList(book);
        });
    }
    static removeBook(isbn) {
        let books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Add event listener
form.addEventListener('submit', newBook);
booklist.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Define functions
function newBook(e) {
    let title = document.querySelector('#title').value, // Use .value instead of .Value
        author = document.querySelector('#author').value, // Use .value instead of .Value
        isbn = document.querySelector('#isbn').value; // Use .value instead of .Value

    if (title === '' || author === '' || isbn === '') {
        Ui.showAlert("Please fill all the fields!", "error");
    } else {
        let book = new Book(title, author, isbn);
        Ui.addBookList(book);
        Ui.clearFields();
        Ui.showAlert("Book Added", "success");
        Store.addBook(book);
    }
    e.preventDefault();
}

function removeBook(e) {
    Ui.deleteFromBook(e.target);
    e.preventDefault(); // Prevent the default behavior of link
}
