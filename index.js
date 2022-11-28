import FQ from 'filequeue-gliph';
import { randomBytes } from 'crypto';
import { resolve } from 'path';

let tablePath
let tableRows

var __dirname

var db = {}

var fs = new FQ(2000)

var isWindows = process.platform === 'win32';

async function setPath(path) {
    __dirname = resolve(path || process.cwd());
    // check if db exists
    return new Promise(function (resolve, reject) {
        fs.exists(__dirname, function (exists) {
            if (exists) {
                resolve()
            } else {
                fs.mkdir(__dirname, function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        })
    })

}


async function table(table) {

    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    // check if table exists
    return new Promise(function (resolve, reject) {
        fs.exists(tablePath, function (exists) {
            if (exists) {
                // table exists
                var tableObj = {
                    path: tablePath,
                    insert: function (row) {
                        return insert(table, row);
                    },
                    update: function (row, newData) {
                        return update(table, row, newData);
                    },
                    getWithFilter: function (filter) {
                        return getWithFilter(table, filter);
                    },
                    get: function (id) {
                        return get(table, id);
                    },
                    delete: function (id) {
                        return remove(table, id);
                    },
                    count: function () {
                        return count(table);
                    }
                }
                resolve(tableObj);
            } else {
                // table does not exist
                // create table
                fs.mkdir(tablePath, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        var tableObj = {
                            path: tablePath,
                            insert: function (row) {
                                return insert(table, row);
                            },
                            update: function (row, newData) {
                                return update(table, row, newData);
                            },
                            getWithFilter: function (filter) {
                                return getWithFilter(table, filter);
                            },
                            get: function (id) {
                                return get(table, id);
                            },
                            delete: function (id) {
                                return remove(table, id);
                            },
                            count: function () {
                                return count(table);
                            }
                        }

                        resolve(tableObj);
                    }
                });
            }
        })
    });
}

async function insert(table, row) {

    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }

    // create a random id
    var id = randomBytes(16).toString('hex');
    return new Promise(function (resolve, reject) {
        fs.exists(tablePath, function (exists) {
            if (!exists) {

                db.table(tablePath, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        if (!row.id) {
                            row.id = id;
                        }

                        if (isWindows) {
                            var rowPath = __dirname + '\\' + table + '\\' + row.id;
                        } else {
                            var rowPath = __dirname + '/' + table + '/' + row.id;
                        }

                        fs.writeFile(rowPath, JSON.stringify(row), function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row);
                            }
                        });
                    }
                });
            } else {
                if (!row.id) {
                    row.id = id;
                }

                if (isWindows) {
                    var rowPath = __dirname + '\\' + table + '\\' + row.id;
                }
                else {
                    var rowPath = __dirname + '/' + table + '/' + row.id;
                }
                fs.writeFile(rowPath, JSON.stringify(row), function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            }
        });
    });
}

async function getWithFilter(table, filter) {

    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    return new Promise(function (resolve, reject) {
        fs.exists(tablePath, function (exists) {
            // check if table exists
            if (exists) {
                // table exists
                // get all rows
                fs.readdir(tablePath, function (err, files) {
                    if (err) {
                        reject(err);
                    } else {
                        var rows = [];
                        var count = 0;
                        files.forEach(function (file) {
                            if (isWindows) {
                                var rowPath = __dirname + '\\' + table + '\\' + file;
                            } else {
                                var rowPath = __dirname + '/' + table + '/' + file;
                            }

                            // read the row

                            var row = fs.readFile(rowPath, function (err, data) {
                                if (err) {
                                    reject(err);
                                } else {
                                    var row = JSON.parse(data);
                                    // check if the row matches the filter
                                    var match = true;
                                    for (var key in filter) {
                                        if (row[key] != filter[key]) {
                                            match = false;
                                        }
                                    }
                                    if (match) {
                                        rows.push(row);
                                    }
                                    count++;
                                    if (count == files.length) {
                                        resolve(rows);
                                    }
                                }
                            });
                        });
                    }
                });
            } else {
                // table does not exist
                reject('table does not exist');
            }
        });
    });
}

async function get(table, id) {

    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    return new Promise(function (resolve, reject) {
        fs.exists(tablePath, function (exists) {
            // check if table exists
            if (exists) {
                // table exists
                // get all rows
                fs.readdir(tablePath, function (err, files) {
                    if (err) {
                        reject(err);
                    } else {
                        var rows = [];
                        var count = 0;
                        files.forEach(function (file) {
                            if (isWindows) {
                                var rowPath = __dirname + '\\' + table + '\\' + file;
                            } else {
                                var rowPath = __dirname + '/' + table + '/' + file;
                            }

                            // read the row

                            var row = fs.readFile(rowPath, function (err, data) {
                                if (err) {
                                    reject(err);
                                } else {
                                    var row = JSON.parse(data);
                                    // check if the row matches the filter
                                    var match = true;
                                    if (row.id != id) {
                                        match = false;
                                    }
                                    if (match) {
                                        rows.push(row);
                                    }
                                    count++;
                                    if (count == files.length) {
                                        resolve(rows);
                                    }
                                }
                            });
                        });
                    }
                });
            } else {
                // table does not exist
                reject('table does not exist');
            }
        });
    });
}

async function update(table, row, newData) {
    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    return new Promise(function (resolve, reject) {
        (async () => {
            try {
                var data = await dgetWithFilter(table, row);
                if (data.length > 0) {
                    // row exists
                    // update the row
                    var row = data[0];
                    for (var key in newData) {
                        row[key] = newData[key];
                    }
                    
                    if (isWindows) {
                        var rowPath = __dirname + '\\' + table + '\\' + row.id;
                    } else {
                        var rowPath = __dirname + '/' + table + '/' + row.id;
                    }

                    fs.writeFile(rowPath, JSON.stringify(row), function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                } else {
                    // row does not exist
                    reject('row does not exist');
                }
            } catch (err) {
                reject(err);
            }
        })();
    });
}

async function remove(table, row) {

    if (isWindows) {
        tablePath = __dirname + '\\' + table
    } else {
        tablePath = __dirname + '/' + table
    }
    return new Promise(function (resolve, reject) {
        fs.exists(tablePath, function (exists) {
            (async () => {
                try {
                    var data = await getWithFilter(table, row);
                    if (data.length > 0) {
                        // row exists
                        // delete the row
                        var row = data[0];
                        if (isWindows) {
                            var rowPath = __dirname + '\\' + table + '\\' + row.id;
                        } else {
                            var rowPath = __dirname + '/' + table + '/' + row.id;
                        }

                        // delete the row

                        fs.unlink(rowPath, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row);
                            }
                        });
                    } else {
                        // row does not exist
                        reject('row does not exist');
                    }
                } catch (err) {
                    reject(err);
                }
            })();
        });
    });
}

export {
    setPath,
    table,
    get,
    getWithFilter,
    update,
    remove
}
