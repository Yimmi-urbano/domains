const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        unique: true
    },
    type_domain: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Domains', domainSchema);
