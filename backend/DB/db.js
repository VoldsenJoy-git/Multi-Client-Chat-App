const mongoose = require( "mongoose");
  
const connectDB = async (req, res) => {
    const mongoURL = "mongodb://localhost:27017";
    
    const { connection } = await mongoose.connect(mongoURL, { useNewUrlParser: true });

    console.log(`MongoDB Connected to ${connection.host}`);
}

module.exports = connectDB;


