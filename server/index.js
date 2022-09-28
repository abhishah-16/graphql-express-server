const express = require('express')
const colors = require('colors')
const connect = require('./database/db')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const port = process.env.PORT || 5000
const app = express()

connect()
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`Server is Running at ${port} :)`.white.bold.italic);
})