# Gliph
## A simple nosql database for node.js

Gliph is a simple nosql database for node.js made from scratch. 
It is a simple document database with minimal functionality. 
This is not meant to be a replacement for MongoDB or CouchDB, but rather a simple database for small projects and beginners.

### Installation

    npm install gliph

### API Documentation

#### Gliph

##### Gliph.setDBPath(path, callback)

Sets the path to the database. This function must be called before any other function.

    Gliph.setDBPath('./db', function(err, dir) {
        if (err) {
            console.log(err);
        } else {
            console.log('Database path set to ' + dir);
        }
    });

##### Gliph.table(name, callback)

Creates a new table. (does nothing if it already exists)

    Gliph.table('users', function(err, tablePath) {
        if (err) {
            console.log(err);
        } else {
            console.log('Table created at ' + tablePath);
        }
    });

##### Gliph.update(table, row, newData, callback)

Updates a row in a table.

    Gliph.update('users', {name: 'John'}, {name: 'John', age: 25}, function(err, row) {
        if (err) {
            console.log(err);
        } else {
            console.log('Row updated: ' + row);
        }
    });

##### Gliph.insert(table, row, callback)

Inserts a row into a table.

    Gliph.insert('users', {name: 'John', age: 25}, function(err, row) {
        if (err) {
            console.log(err);
        } else {
            console.log('Row inserted: ' + row);
        }
    });

##### Gliph.delete(table, row, callback)

Deletes a row from a table.

    Gliph.delete('users', {name: 'John'}, function(err, row) {
        if (err) {
            console.log(err);
        } else {
            console.log('Row deleted: ' + row);
        }
    });

## that's all for now, happy creating!