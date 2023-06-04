const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const createError = require('http-errors')


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"firstname is required"],
        minLength: [3,"firstname muse be at least 3 characters"],
        mixLength: [30,"firstname muse be at most 3 characters"],
        match: [/^[a-zA-Z ,']+$/i,"Enter valid firstname"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true,"lastname is required"],
        minLength: [3,"lastname muse be at least 3 characters"],
        mixLength: [30,"lastname muse be at most 3 characters"],
        match: [/^[a-zA-Z ,']+$/i,"Enter valid lastname"],
        trim: true
    },
    username: {
        type: String,
        required: [true,"username is required"],
        unique: [true,"this user name is already exist"],
        trim: true
    },
    password: {
        type: String,
        required: [true,"password is required"],
        minLength: [8,"password muse be at least 8 characters"],
        match: [/^(?=.*[A-Za-z])(?=.*\d).+$/ , "Enter at least 1 alphabetic character and 1 number"]
    },
    gender : {
        type: String,
        enum : ["male","female","not-set"],
        default:"not-set"
    },
    phoneNumber:{
        type:String,
        unique:true,
        trime: true,
        required: true,
        validate: [
            {
                validator: val => {
                    return typeof val === "string"
                },
                message: "phone number must be type of String"
            },
            {
                validator: val => {
                    return /^(\+98)9\d{9}$/.test(val);
                },
                message: "phone number must be format of : +98-9-???-??-??"
            }
        ]
    },
    role : {
        type: String,
        enum: ["admin","blogger"],
        default:"blogger"
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});


// hash password before save
UserSchema.pre("save", async function(next) {
    if (!this.isNew && !this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        return next();
    } catch (err) {
        next(err);
    };
});

// create method to check hashed password
UserSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

// create default admin
(async (next) => {
    try {
        const User = mongoose.model('User',UserSchema);
        // const adminUser = await User.countDocuments({});
        const adminUser = await User.findOne({role:'admin'})
        // console.log(adminUser)
        if (!adminUser) {
            const admin = new User({
                firstName: 'admin',
                lastName: 'admin',
                username: 'admin',
                password: 'admin123',
                gender: 'male',
                avatar: "/images/userAvatars/icon.png",
                phoneNumber: '+989110000000',
                role: 'admin',
            });
            await admin.save();
            console.log('Default admin user created.');
        } else {
        console.log('Admin user already exists.');
        }
    } catch (err) {
        next(err)
    }
})()


module.exports = mongoose.model("user", UserSchema);