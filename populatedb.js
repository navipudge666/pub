#! /usr/bin/env node
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Customer = require('./models/customer')
var Reservation = require('./models/reservation')
var Table = require('./models/table')
//var BookInstance = require('./models/bookinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var customers = [];
var reservations = [];
var tables = [];

function customerCreate(firstName, secondName, phoneNumber, cb) {
    customerDetail = {
        firstName: firstName, 
        secondName: secondName, 
        phoneNumber: phoneNumber
    }
    var customer = new Customer(customerDetail);
    customer.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Customer: ' + customer);
        customers.push(customer)
        cb(null, customer)
    });
}

function reservationCreate(id, table, customer, dateFrom, dateTo, cb){
    reservationDetail = {
      id:id, 
      table:table, 
      customer:customer, 
      dateFrom:dateFrom,
      dateTo:dateTo
    }
    var reservation = new Reservation(reservationDetail);
    reservation.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New Reservation: ' + reservation);
      reservations.push(reservation)
      cb(null, reservation)
    });
}

function tableCreate(id, capacity, cb){
    tableDetail = {
        id:id, 
        capacity:capacity
    }
    var table = new Table(tableDetail);
    table.save(function (err) {
        if (err) {
          cb(err, null)
          return
        }
        console.log('New Table: ' + table);
        tables.push(table)
        cb(null, table)
    })
}

function createCustomers(cb) {
    async.series([
        function(callback) {
            customerCreate('firstName1', 'firstName2', '+71112223344', callback);
        },
        function(callback) {
            customerCreate('secondName1', 'secondName2', '+71002003040', callback);
        },
        ],
        // optional callback
        cb);
}

function createTables(cb){
    async.series([
        function(callback) {
            tableCreate(1, 2, callback);
        },
        function(callback) {
            tableCreate(2, 2, callback);
        },
        function(callback) {
            tableCreate(3, 4, callback);
        },
        function(callback) {
            tableCreate(4, 4, callback);
        },
        ],
        // optional callback
        cb);
}

function createReservations(cb){
    async.series([
        function(callback) {
            reservationCreate(1, tables[0], customers[0], '2021-12-25T18:00:00', '2021-12-25T20:00:00', callback);
        },
        function(callback) {
            reservationCreate(2, tables[1], customers[1], '2021-12-25T15:00:00', '2021-12-25T19:00:00', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCustomers,
    createTables,
    createReservations
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('reservations: '+ reservations);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



