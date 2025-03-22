import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },

    packaging:{
        type: String,
        required: true,
    },
}, {
  timestamps: true
});

