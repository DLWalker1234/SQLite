// Require in the Database method from the sqlite3 module
// We will be using the verbose execution mode, which will help with debugging errors.
const { Database } = require('sqlite3').verbose();

// Returns a new database object and automatically opens the database
// Database method accepts a callback function for successful connection
const db = new Database('example.sqlite', () => console.log('Connected!'));

// Creates a database which will be written to a file on disk
// Changes will persist once connection closes
const db = new Database('db/example.sqlite');

// Passing in IF NOT EXISTS after CREATE TABLE will check to make sure there are no tables named 'employees'
// If it does exist, this line will not run
db.run("CREATE TABLE IF NOT EXISTS employees (id INT, first TEXT, last TEXT)");

db.run("INSERT INTO employees (id, first, last) VALUES (1, 'Michael', 'Scott')");
// employees TABLE
// id |  first    |   last
//  1 | 'Michael' | 'Scott'

db.run("INSERT INTO employees VALUES (2, 'Jim', 'Halpert')");
// employees TABLE
// id |  first    |   last
//  1 | 'Michael' | 'Scott'
//  2 | 'Jim'     | 'Halpert

const employeeArray = [
    { id: 3, firstName: 'Dwight', lastName: 'Schrute' },
    { id: 4, firstName: 'Andy', lastName: 'Bernard' },
    { id: 5, firstName: 'Pam', lastName: 'Beesly' }
];

employeeArray.forEach((obj) => {
    // Using ES6 string templating, we can create an insert statement for each object
    db.run(`INSERT INTO employees VALUES (${obj.id}, '${obj.firstName}', '${obj.lastName}')`);
});

// employees TABLE
// id |  first   |   last
//  1 | 'Michael'| 'Scott'
//  2 | 'Jim'    | 'Halpert'
//  3 | 'Dwight' | 'Schrute'
//  4 | 'Andy'   | 'Bernard'
//  5 | 'Pam'    | 'Beesly'

// db.all() first runs the query
// then calls a callback function which it passes all resulting rows
db.all("SELECT * FROM employees", (err, allRows) => {
    // allRows is an array containing each row from the query
    allRows.forEach(each => {
        console.log(each.id, each.first + ' ' + each.last);
    });
});
// OUTPUT =>
// 1, 'Michael Scott'
// 2, 'Jim Halpert'
// 3, 'Dwight Schrute'
// 4, 'Andy Bernard'
// 5, 'Pam Beesly'

// errorHandler is a function which accepts an error object
const errorHandler = (err) => {
    if (err) { // If there is an error obj, it will be console logged
        console.log(`Msg: ${err}`);
    };
};

// If an error is thrown when this statement is run, our function
// will log it to the console
db.run("INSERT INTO employees VALUES (2, 'Jim', 'Halpert')", errorHandler);


db.all("SELECT * FROM employees", (err, allRows) => {
    errorHandler(err); // We can also check for errors here

    // <-- Do something with results from database -->
});

db.close(err => {
    errorHandler(err); // Use custom error handling function
    console.log('Database closed'); // Will only log on successful close
})