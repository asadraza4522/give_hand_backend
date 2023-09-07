const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const AddressSchema = new Schema({

    mobile:{
        required:true,
        type:String
    },
    address:{
        required:true,
        type:String
    }

},{timestamps:false})

const UserSchema = new Schema({

    platform_id:{
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        required: true
    },
    mobile:{
        type:String,
    },
    gender:{
        type:String
    },
    avatar:{
        type:String
    },
    assertion:{
        type:String,
        required:true
    },
    address:{
        type:[AddressSchema]
    },
    stripe_id:{
        type:String,
    },
    is_stripe_connected:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('user', UserSchema)

module.exports = User;