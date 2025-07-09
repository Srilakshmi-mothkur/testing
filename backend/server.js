const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path');
const PORT = process.env.PORT || 3000

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const matchRoutes = require('./routes/matchRoutes');
const progressRoutes = require('./routes/progressRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB()

const app = express()
app.use(express.json())
app.use(cors ({
    origin: "https://testing-frontend-one.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ['Content-type', 'Authorization']
}))

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api', chatRoutes);
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})