const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/midi-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const midiSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    uploadedAt: { type: Date, default: Date.now },
});

const Midi = mongoose.model('Midi', midiSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.post('/api/midi/upload', upload.single('midi'), async (req, res) => {
    try {
        const midi = new Midi({
            name: req.body.name,
            data: req.file.buffer,
        });
        await midi.save();
        res.status(200).send({ message: 'MIDI clip uploaded successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to upload MIDI clip' });
    }
});

app.get('/api/midi/list', async (req, res) => {
    try {
        const midis = await Midi.find({}, 'name uploadedAt');
        res.status(200).send(midis);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve MIDI clips' });
    }
});

app.get('/api/midi/:id', async (req, res) => {
    try {
        const midi = await Midi.findById(req.params.id);
        if (!midi) {
            return res.status(404).send({ error: 'MIDI clip not found' });
        }
        res.status(200).send(midi);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve MIDI clip' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
