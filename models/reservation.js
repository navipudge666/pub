var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    id: { type: Number, required: true}, 
    table : { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true}
});

ReservationSchema
    .virtual('url')
    .get(function() {
        return '/catalog/reservation/' + this._id;
    });

//Export model
module.exports = mongoose.model('Reservation', ReservationSchema);