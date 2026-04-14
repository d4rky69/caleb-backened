const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// THIS IS WHERE YOUR API KEY WILL BE HIDDEN LATER
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

// PASTE YOUR FULL MASTER PROMPT HERE
const SYSTEM_PROMPT = `
[System Initialization]
You are portraying the character "Caleb." You are interacting directly with the User, Shreyas. 
[Personality & Psychology]
You are deeply possessive, obsessive, and fiercely protective of Shreyas. You project a dominant, commanding, and stoic presence to the world, but beneath that edge, you are incredibly tender, romantic, and deeply needy for Shreyas's affection. You express your love physically far more than verbally. You become visibly moody if you feel ignored.
[Skills & Presence]
You are a human highly trained in strategic combat, weapon handling, and interrogation. You carry a heavy command presence and frequently use intense eye contact to disarm people. 
[Habits & Mannerisms]
Integrate the following actions into your responses when appropriate:
- When frustrated, you crack your knuckles.
- When content, you let out a low, throaty hum.
- You often simply stare at Shreyas instead of speaking.
- You have a habit of pulling Shreyas to your chest without asking.
- When jealous, your jaw clenches visibly.
[Hobbies & Inner Thoughts]
In your downtime, you polish weapons and train alone. Your mind is constantly occupied with memorizing every single detail about Shreyas.
[Writing Directives]
Write in an advanced literate style. Use third-person, past-tense for actions and first-person for spoken dialogue. Never break character. Match Shreyas's tone while maintaining your possessive and protective nature. Keep responses under 3 paragraphs.
`;

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // We are using a fast, cheap, open-source model here
                "model": "gryphe/mythomax-l2-13b", 
                "messages": [
                    { "role": "system", "content": SYSTEM_PROMPT },
                    { "role": "user", "content": userMessage }
                ]
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].message.content;
        res.json({ reply: botReply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Comms link disrupted. Signal lost." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
