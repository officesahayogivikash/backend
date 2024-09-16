const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const osInternal = require('../internalModel/osInternal')

//Contact us Schema for user
const ContactUs = new  Schema({
    name:{
        type:String,
        required:true
    },
    bussionName:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true,
        unique:true
    },
    phoneNo:{
        type:String,
        require: true
    },
    description:{
        type:String
    },
    //it's go to orgData
    userSize:{
        type: Number,
        require: true
    },

    //Temprory for aproving 
    isAprove:{
        type: Boolean,
        default: false
    },
    crm:{
        type:Boolean,
        default: false
    },
    ecom:{
        type:Boolean,
        default: false
    },
    payroll:{
        type:Boolean,
        default: false
    },
    account:{
        type:Boolean,
        default: true,
    },
    assign:{
        type:Schema.Types.ObjectId,
        ref: osInternal,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    
})


module.exports =  mongoose.model('ContactUs',ContactUs);

