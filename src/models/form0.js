const mongoose = require('mongoose')

const form0Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        validate(value){
            if (value === 'form') {
                throw new Error('Name of the form cannot be "form"')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Please provide a valid age')
            }
        }
    },
    operatingSystem:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Form0 = mongoose.model('Form0', form0Schema)

module.exports = Form0