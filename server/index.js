const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        config: {
            apiKey: '',
            baseURL: 'https://api.openai.com/v1',
            model: 'gpt-3.5-turbo'
        },
        history: []
    }, null, 2));
}

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        return { config: {}, history: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// API: Get Config
app.get('/api/config', (req, res) => {
    const db = readDB();
    res.json(db.config);
});

// API: Get History
app.get('/api/history', (req, res) => {
    const db = readDB();
    const history = (db.history || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(history);
});

// API: Save History Item
app.post('/api/history', (req, res) => {
    const db = readDB();
    const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        prompt: req.body.prompt,
        code: req.body.code,
        files: req.body.files || []
    };

    if (!db.history) db.history = [];
    db.history.push(newItem);
    writeDB(db);
    res.json(newItem);
});

// API: Delete History Item
app.delete('/api/history/:id', (req, res) => {
    const db = readDB();
    if (db.history) {
        db.history = db.history.filter(item => item.id !== req.params.id);
        writeDB(db);
    }
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
