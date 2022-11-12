// document database that has a folder acts as a table and files inside the folder acts as rows (with strict schema validation)
// the document database is a key-value store, where the key is the file name and the value is the file content

import FQ from 'filequeue-gliph';
import { randomBytes } from 'crypto';
import { resolve } from 'path';

let tablePath
let tableRows

var __dirname

var db = {}

var fs = new FQ(1000)

var isWindows = process.platform === 'win32';

db.setDBPath = function(path, callback) {
    __dirname = path;
    __dirname = resolve(path || process.cwd());
    
    // check if db path exists
    // make sure db path is in the same directory as the index.js file that is using this module
    fs.exists(__dirname, function(exists) {
        
        if(!exists) {
            fs.mkdir(__dirname, function(err) {
                if(err) {
                    callback(err)
                    return
                }
                callback(null, __dirname)
            })
        } else {
            callback(null, __dirname)
        }
    })
}



db.table = function(table, callback) {

    if(isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    console.log('creating table ' + tablePath);
    
    // check if table exists
    fs.exists(tablePath, function(exists) {
        if (exists) {
            // table exists
            callback(null, tablePath);
        } else {
            // table does not exist
            // create table
            fs.mkdir(tablePath, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, tablePath);
                }
            });
        }
    });
}

db.insert = function(table, row, callback) {
    
    if(isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }

    // create a random id
    var id = randomBytes(16).toString('hex');

    fs.exists(tablePath, function(exists) {
        if (!exists) {

            db.table(tablePath, function(err) {
                if (err) {
                    callback(err);
                } else {
                    if(!row.id) {
                        row.id = id;
                    }
                    
                    if(isWindows) {
                        var rowPath = __dirname + '\\' + table + '\\' + row.id;
                    } else {
                        var rowPath = __dirname + '/' + table + '/' + row.id;
                    }

                    fs.writeFile(rowPath, JSON.stringify(row), function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, row);
                        }
                    });
                }
            });
        } else {
            if(!row.id) {
                row.id = id;
            }

            if(isWindows) {
                var rowPath = __dirname + '\\' + table + '\\' + row.id;
            }
            else {
                var rowPath = __dirname + '/' + table + '/' + row.id;
            }
            fs.writeFile(rowPath, JSON.stringify(row), function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, row);
                }
            });
        }
    });
}


db.update = function(table, row, newData, callback){
    
    if(isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }

    // search for the row with getWithFilter
    db.getWithFilter(table, row, function(err, data) {
        if (err) {
            callback(err);
        } else {
            if (data.length > 0) {
                // row exists
                // update the row
                if(isWindows) {
                    var rowPath = __dirname + '\\' + table + '\\' + data[0].id;
                } else {
                    var rowPath = __dirname + '/' + table + '/' + data[0].id;
                }
                // only update the fields that are in the newData object
                for (var key in newData) {
                    data[0][key] = newData[key];
                }
                fs.writeFile(rowPath, JSON.stringify(data[0]), function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data[0]);
                    }
                });
            } else {
                // row does not exist
                callback('row does not exist');
            }
        }
    });
    
}


db.delete = function(table, id, callback) {
    var rowPath
    if(isWindows) {
        tablePath = __dirname + '\\' + table
        rowPath = __dirname + '\\' + table + '\\' + id;
    } else {
        tablePath = __dirname + '/' + table
        rowPath = __dirname + '/' + table + '/' + id;
    }

    fs.exists(tablePath, function(exists) {
        if (exists) {
            // table exists
            // check if row exists
            fs.exists(rowPath, function(exists) {
                if (exists) {
                    // row exists
                    // delete row

                    fs.unlink(rowPath, function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, id);
                        }
                    }
                    );
                } else {
                    // row does not exist
                    callback('row does not exist');
                }
            });
        } else {
            // table does not exist
            callback('table does not exist');
        }
    });
    
}

db.get = function(table, id, callback) {
    
    if(isWindows) {
        var rowPath = __dirname + '\\' + table + '\\' + id;
    } else {
        var rowPath = __dirname + '/' + table + '/' + id;
    }

    fs.exists(rowPath, function(exists) {
        if (!exists) {
            callback(new Error('row does not exist'));
        } else {
            fs.readFile(rowPath, function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, JSON.parse(data));
                }
            });
        }
    });
}


db.getAll = function(table, callback) {
    
    if(isWindows) {
        var tablePath = __dirname + '\\' + table;
    } else {
        var tablePath = __dirname + '/' + table;
    }

    fs.exists(tablePath, function(exists) {
        if (!exists) {
            callback(new Error('table '+table+' does not exist'));
        } else {
            fs.readdir(tablePath, function(err, files) {
                if (err) {
                    callback(err);
                } else {
                    tableRows = [];
                    files.forEach(function(file) {
                        if(isWindows) {
                            var rowPath = __dirname + '\\' + table + '\\' + file;
                        } else {
                            var rowPath = __dirname + '/' + table + '/' + file;
                        }
                        
                        // read the file
                        fs.readFile(rowPath, function(err, data) {
                            if (err) {
                                callback(err);
                            } else {
                                tableRows.push(JSON.parse(data));
                                if (tableRows.length == files.length) {
                                    callback(null, tableRows);
                                }
                            }
                        });
                    });
                }
            });
        }
    });
}




db.getWithFilter = function(table, filter, callback) {
    // fix path argument not being a string
    if(isWindows) {
        var tablePath = __dirname + '\\' + table;
    } else {
        var tablePath = __dirname + '/' + table;
    }
    db.getAll(table, function(err, rows) {
        if (err) {
            callback(err);
        } else {
            var filteredRows = [];
            rows.forEach(function(row) {
                var match = true;
                for (var key in filter) {
                    if (row[key] !== filter[key]) {
                        match = false;
                    }
                }
                if (match) {
                    filteredRows.push(row);
                }
            });
            callback(null, filteredRows);
        }
    });
    
}

export default db