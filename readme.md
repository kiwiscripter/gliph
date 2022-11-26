# Gliph
## A simple nosql database for node.js

Gliph is a simple nosql database for node.js made from scratch. 
It is a simple document database with minimal functionality. 
This is not meant to be a replacement for MongoDB or CouchDB, but rather a simple database for small projects and beginners.

### Installation

    npm install gliph

### Documentation

#### Gliph

    import Gliph from 'gliph';

##### Gliph.setPath(path) -> Promise (void)

Sets the path to the database. Returns a promise that resolves when the database is ready.

##### Gliph.get(table, id) -> Promise (object)

Gets a document from the database. Returns a promise that resolves with the document.

##### Gliph.table(table) -> Promise  (functions (all that are listed below except Gliph.table))

_NOTE: table parameter is not required when you use the functions that are a result of Gliph.table(table)._

Returns an object with functions that are bound to the table.

##### Gliph.get(table, id) -> Promise (object)

Gets a document from the database. Returns a promise that resolves with the document.

##### Gliph.getWithFilter(table,filter) -> Promise (array)

Gets all documents from the database that match the filter. Returns a promise that resolves with an array of documents.

##### Gliph.insert(table, document) -> Promise (object)

Inserts a document into the database. Returns a promise that resolves with the inserted document.

##### Gliph.update(table, filter, document) -> Promise (object)

Updates a document in the database. Returns a promise that resolves with the updated document.

##### Gliph.delete(table, filter) -> Promise (object)

Deletes a document from the database. Returns a promise that resolves with the deleted document.

### Have fun with Gliph!