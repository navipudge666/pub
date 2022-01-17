var express = require('express');
var router = express.Router();

var reservationController = require('../controllers/reservationController');
var customerController = require('../controllers/customerController');

router.get('/', reservationController.index);

router.get('/reservations', reservationController.reservation_list);

router.post('/reservations', reservationController.reservation_create_post);

module.exports = router;