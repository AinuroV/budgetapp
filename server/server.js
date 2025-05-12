require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const router = require('./router/index')
const cors = require('cors');


const PORT = process.env.PORT || 4444
const app = express()
const corsOptions = {
    origin: 'http://localhost:5173', // Точный адрес вашего фронтенда
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json())

app.use('/api', router)



const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`\nserver started on ${PORT} port`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()

