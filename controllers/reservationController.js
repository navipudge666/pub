var Reservation = require('../models/reservation');
var Customer = require('../models/customer');
var Table = require('../models/table');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        customer_count: function(callback){
            Customer.countDocuments({}, callback);
        },
        table_count: function(callback){
            Table.countDocuments({}, callback);
        },
        reservation_count: function(callback){
            Reservation.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Pub Home',  data: results} );
    })
};

exports.reservation_list = function(req, res, next){
    Reservation.find({})
        .populate('table')
        .populate('customer')
        .exec(function(err, reservations){
            if (err) { return next(err); }
            var times = [];
            for (var i = 10; i <= 23; i++)
                times.push(i);
            Table.find({})
                .sort({number : 1})
                .exec(function(err, tables){
                    res.render('reservations', { title : 'Reservations for today', reservations: reservations, tables:tables, times: times} )
            })
        })
};

exports.reservation_create_post = function(req, res) {
    //console.log(req.body);
    var customer_name = req.body.customer_name.split(' ');
    var customer_phone = req.body.customer_phonenumber;
    var table_id = req.body.table_id;
    var time_from = Number(req.body.time_from);
    var time_to = Number(req.body.time_to);
    if (time_to <= time_from){
        res.send("Incorrect input");
        return;
    }
    Table.findOne({id : table_id}).exec(function(err, table){
        //console.log(table);
        Reservation.find({table: table._id})
            .populate({ path: 'table'} )
            .populate('customer')
            .exec(function(err, reservations){
                //console.log(reservations);
                var time_is_reserved = false;
                reservations.forEach(reservation => {
                    var today = new Date()
                    if (reservation.table.id != table.id || 
                        today.getDate() == reservation.dateTo.getDate() && today.getMonth() == reservation.dateTo.getMonth())
                    {
                        var start = reservation.dateFrom.getHours();
                        var end = reservation.dateTo.getHours();
                        if (time_from <= start && start < time_to || time_from < end && end < time_to
                            || start <= time_from && end >= time_to)
                            time_is_reserved= true;
                    }
                })
                if (time_is_reserved)
                    res.send('This time is already reserved')
                else {
                    Reservation.find({}).sort({id: -1}).exec(function(err, result){

                        var new_id = 0;
                        if (result.length > 0) new id = result[0].id + 1;
                        Customer.find({phoneNumber: customer_phone}).exec(function(err, customers){
                            var customer;
                            if (customers.length == 0){
                                customer = new Customer({
                                    firstName: customer_name[0],
                                    secondName: (customer_name.length > 1? customer_name[1] : '-'),
                                    phoneNumber: customer_phone
                                })
                                customer.save()
                                //console.log(customer);
                            }
                            else customer = customers[0];
                            //console.log(customer);
                            var new_dateFrom = new Date();
                            new_dateFrom.setHours(time_from, 0, 0);
                            var new_dateTo = new Date();
                            new_dateTo.setHours(time_to, 0, 0);
                            var new_reservation = new Reservation({
                                id: new_id,
                                table: table,
                                customer: customer,
                                dateFrom: new_dateFrom,
                                dateTo: new_dateTo
                            });
                            new_reservation.save();
                            res.send("Reserved succesfully")

                            //console.log(new_reservation);
                        })
                    })
                }
            })
    })
};

exports.reservation_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: reservation delete GET');
};

exports.reservation_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: reservation delete POST');
};
