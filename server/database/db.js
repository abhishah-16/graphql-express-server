const mongoose = require('mongoose')
const connect = async () => {
    const connect = await mongoose.connect('mongodb+srv://abhishah0196:abhishah@cluster0.w9drn.mongodb.net/gql-express')
    console.log(`MongoDB Connected: ${`${connect.connection.host}`.blue} ${`Database`.cyan}: ${`${connect.connection.name}`.blue}  :)`.cyan.bold.italic);
}

module.exports = connect
