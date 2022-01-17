var Customer = require("../models/customer");

exports.customer_list = function(req, res){
    res.send('NOT IMPLEMENTED: customer list');
}

exports.customer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: customer detail: ' + req.params.id);
};

exports.customer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: customer create GET');
};

exports.customer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: customer create POST');
};

exports.customer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: customer delete GET');
};

exports.customer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: customer delete POST');
};

exports.customer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: customer update GET');
};

exports.customer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: customer update POST');
};