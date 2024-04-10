import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String
  });

const User = mongoose.model('User', userSchema);

export { User };