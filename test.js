import db from './index.js'

// run tests

var time = new Date().getTime()

async function test() {
    // create database path
    var h = await db.dbpath('./db')

    // create a table
    var table = await db.table('test')
    
    // test a simple insert
    var insert = await table.insert({name: 'test', time: time})
    console.log(insert)

    // test a simple get by id
    var get = await table.get(insert.id)
    console.log(get)

    // test a simple get by filter
    var filter = await table.getWithFilter({name: 'test'})
    console.log(filter)

    // test a simple update
    var update = await table.update({name:'test'}, {name: 'test2'})
    console.log(update)

    // test a simple delete
    var del = await table.delete(insert.id)
}

test()