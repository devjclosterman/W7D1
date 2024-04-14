const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

let messageCount = 0; // To keep track of the number of messages received

app.post('/messages', (req, res, next) => {
    if (messageCount >= 5) {
        return res.status(429).json({ error: 'Too Many Requests' });
    }

    const { text } = req.body;
    if(!text) {
        return res.status(400).json({ error: "Bad Request: 'text' is required" });
    }

    console.log(text); //Log the text to the console
    messageCount++; //Increment the message count
    res.json({ message : "Message received loud and clear"});
});

app.listen(3000, () => console.log('Server running on port 3000'));