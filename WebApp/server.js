
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURL = 'mongodb+srv://Olga_Evfs_db:admin123456789@cluster0.lufqfjc.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0';
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
            await MenuItem.insertMany(json.menu);
            console.log('Database seeded successfully.');
        } else {
            console.log('Menu collection already contains data. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

const Request = mongoose.model('Request', requestSchema);

// API Routes
app.post('/api/requests', async (req, res) => {
    try {
        const newRequest = new Request(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server and seed database
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    seedDatabase();
});
