const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
       
   
        email_id: { type: String },
    
        password: String,
   
        phoneNumber: String,
   
        name: { type: String },

    },
    { 
        timestamps: true 
    });

const User = mongoose.model('User', userSchema);

module.exports = User;
