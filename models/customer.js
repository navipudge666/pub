var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    firstName : { type: String, required: true},
    secondName: { type: String, required: true},
    phoneNumber: { type: String, required: true}
});

CustomerSchema
    .virtual('url')
    .get(function() {
        return '/catalog/user/' + this._id;
    });

//Export model
module.exports = mongoose.model('Customer', CustomerSchema);