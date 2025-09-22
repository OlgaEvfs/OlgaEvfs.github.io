
const express = require('express');
const mongoose = require(mongoose);
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURL = 'mongodb+srv://Olga_Evfs_db:<admin123456789>@cluster0.lufqfjc.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose Schema and Model
const menuSchema = new mongoose.Schema({
    img: String,
    alting: String,
    title: String,
    descr: String,
    price: Number
});

const MenuItem = mongoose.model('menuItem', menuSchema, 'menu');

const requestSchema = new mongoose.Schema({
    name: String,
    phone: String
});

// Function to seed the database
const seedDatabase = async () => {
    try {
        const count = await MenuItem.countDocuments();
        if (count === 0) {
            console.log('No data found in menu collection. Seeding database...');
            const data = fs.readFileSync('db.json', 'utf-8');
            const json = JSON.parse(data);
            await
        }
    }
}