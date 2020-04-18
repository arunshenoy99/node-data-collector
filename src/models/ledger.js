const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    forms: [
        {
            form: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Form'
            }
        }
    ]
})

const Ledger = mongoose.model('Ledger', ledgerSchema)

module.exports = Ledger