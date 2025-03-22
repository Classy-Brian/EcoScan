import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: false, //  Make fields required or optional as needed
  },
  imageUrl: {
    type: String,
    required: false,
  },
  packagings: [
    {
      material: {
          id: { type: String },
          lc_name: { type: String },
        },
        number_of_units: { type: Number },
        recycling: {
          id: { type: String },
          lc_name: { type: String },
        },
        shape: {
          id: {type: String },
          lc_name: {type: String},
        }
    }
  ],
  barcode: {
    type: String,
    required: true, 
    unique: false,  
  },
}, { timestamps: true }); 

const Product = mongoose.model('Product', productSchema);

export default Product;