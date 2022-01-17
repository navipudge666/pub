var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TableSchema = new Schema({
    id: { type: Number, required: true },
    capacity: { type: Number, required: true }
});

TableSchema
    .virtual('url')
    .get(function() {
        return '/catalog/table/' + this._id;
    });

//Export model
module.exports = mongoose.model('Table', TableSchema);