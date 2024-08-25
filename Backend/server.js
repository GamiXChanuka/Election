const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');  // Import the CORS package

const app = express();

const uri = "mongodb+srv://data_user_01:SNPTMzvpDWxtIZDL@cluster0.ze7zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

app.use(cors());  // Use CORS middleware
app.use(express.json());

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const database = client.db('election');
        const votes = database.collection('votes');

        app.get('/votes', async (req, res) => {
            try {
                const results = await votes.findOne({});
                if (!results) {
                    const initialVotes = {
                        'Candidate 1': 0,
                        'Candidate 2': 0,
                        'Candidate 3': 0,
                        'Candidate 4': 0,
                    };
                    await votes.insertOne(initialVotes);
                    res.json(initialVotes);
                } else {
                    res.json(results);
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching votes');
            }
        });

        app.post('/vote', async (req, res) => {
            try {
                const { candidate } = req.body;
                await votes.updateOne({}, { $inc: { [candidate]: 1 } });
                res.status(200).send('Vote submitted successfully');
            } catch (error) {
                console.error(error);
                res.status(500).send('Failed to submit vote. Please try again.');
            }
        });

    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

run();

app.listen(3002, () => {
    console.log('Server running at http://localhost:3002');
});
