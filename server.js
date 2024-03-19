const http = require('http');
const fs = require('fs');


// function to read data from JSON file
function readDataFromFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// function to write data to JSON file
function writeDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}


const server = http.createServer((req, res) => {
    const { method, url, headers } = req;

    // Get books
    if (method === 'GET' && url === '/books') {
        const books = readDataFromFile('./data/books.json');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books));
    }

    // Put books
    else if (method === 'PUT' && url === '/books') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newBook = JSON.parse(body);
            const books = readDataFromFile('./data/books.json');
            books[newBook.id] = newBook;
            writeDataToFile('./data/books.json', books);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook));
        });
    }

    // Delete books
    else if (method === 'DELETE' && url.startsWith('/books/')) {
        const id = url.split('/')[2];
        const books = readDataFromFile('./data/books.json');
        if (books[id]) {
            delete books[id];
            writeDataToFile('./data/books.json', books);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Book with ID ${id} deleted`);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Book not found');
        }
    }

    // Get books/author
    else if (method === 'GET' && url.startsWith('/books/author/')) {
        const authorId = url.split('/')[3];
        const books = readDataFromFile('./data/books.json');
        const authorBooks = Object.values(books).filter(book => book.authorId === authorId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(authorBooks));
    }

    // Post books/author
    else if (method === 'POST' && url.startsWith('/books/author/')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newBook = JSON.parse(body);
            newBook.authorId = url.split('/')[3];
            const books = readDataFromFile('./data/books.json');
            books[newBook.id] = newBook;
            writeDataToFile('./data/books.json', books);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook));
        });
    }

    // Put books/author
    else if (method === 'PUT' && url.startsWith('/books/author/')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedBook = JSON.parse(body);
            updatedBook.authorId = url.split('/')[3];
            const books = readDataFromFile('./data/books.json');
            // Check if the book exists
            if (books[updatedBook.id] && books[updatedBook.id].authorId === updatedBook.authorId) {
                books[updatedBook.id] = updatedBook;
                writeDataToFile('./data/books.json', books);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedBook));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Book not found for the specified author');
            }
        });
    }

    // Handle invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Invalid route');
    }
});

server.listen(3001, () => {
      console.log("Server now runing on 3001")
});
