import db from './index.js'

// run tests

db.setDBPath('./db', (err, res) => {
    // tell us if there was an error
    if (err) {
        console.log("fail: setDBPath");
    } else {
        console.log("success: setDBPath");
        
        // create a table
        db.table('accounts', (err, res) => {
            if (err) {
                console.log("fail: table")
            } else {
                console.log("success: table")
                
                // insert a row
                db.insert('accounts', {
                    "username": "test",
                    "password": "test"
                }, (err, res) => {
                    if (err) {
                        console.log("fail: insert")
                    } else {
                        console.log("success: insert")
                        
                        // getWithFilter a row
                        db.getWithFilter('accounts', {
                            "username": "test"
                        }, (err, res) => {
                            if (err) {
                                console.log("fail: getWithFilter")
                            } else {
                                console.log("success: getWithFilter")
                                
                                // update a row
                                db.update('accounts', {
                                    "username": "test"
                                }, {
                                    "username": "test2",
                                    "password": "test2"
                                }, (err, res) => {
                                    if (err) {
                                        console.log("fail: update")
                                    } else {
                                        console.log("success: update")
                                        
                                        // getWithFilter a row
                                        db.getWithFilter('accounts', {
                                            "username": "test2"
                                        }, (err, res) => {
                                            // delete a row
                                            db.delete('accounts', res[0].id, (err, res) => {
                                                if (err) {
                                                    console.log("fail: delete")
                                                } else {
                                                    console.log("success: delete")
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})
