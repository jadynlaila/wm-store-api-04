const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'must provide a name'],
    },
    price: {
        type: Number,
        required: [true, 'must provide a price']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating:{
        type: Number, 
        default: 4
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: `{VALUE} is not supported`
        }
    }
})

module.exports = mongoose.model("Product", productSchema)