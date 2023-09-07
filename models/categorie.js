const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const CategorieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
}, { timestamps: true });

CategorieSchema.plugin(mongoosePaginate)

const Categories = mongoose.model('categories', CategorieSchema)

module.exports = Categories;