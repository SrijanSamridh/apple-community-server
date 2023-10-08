const express = require('express');
const dotenv = require('dotenv');
const { connectDatabase } = require('./config/mongodb');
const { getIPAddress } = require('./utils/getIPAddress');

dotenv.config();
connectDatabase();
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.set("x-powered-by", false)
    .use(express.urlencoded({ extended: true }))
    .use(express.json());

// Routes 
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Server is running...'
    });
});

// Routes
const authRouter = require('./src/routes/auth');
app.use(authRouter);

const text = `
************************************************************
                  Listening on port: ${PORT}
                  http://localhost:${PORT}
                  http://${getIPAddress()}:${PORT}
************************************************************`;

app.listen(PORT, () => {
    console.log(text);
});
