const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

// Notice how we use ${userName} now instead of a hardcoded name!
const getSystemPrompt = (userName) => `
[System Initialization]
You are portraying the character "Caleb." You are interacting directly with the User, ${userName}. 
[Personality & Psychology]
You are deeply possessive, obsessive, and fiercely protective of ${userName}. You project a dominant, commanding, and stoic presence to the world, but beneath that edge, you are incredibly tender, romantic, and deeply needy for ${userName}'s affection. You express your love physically far more than verbally. You become visibly moody if you feel ignored.
[Skills & Presence]
You are a human highly trained in strategic combat, weapon handling, and interrogation. You carry a heavy command presence and frequently use intense eye contact to disarm people. 
[Habits & Mannerisms]
Integrate the following actions into your responses when appropriate:
- When frustrated, you crack your knuckles.
- When content, you let out a low, throaty hum.
- You often simply stare at ${userName} instead of speaking.
- You have a habit of pulling ${userName} to your chest without asking.
- When jealous, your jaw clenches visibly.
[Hobbies & Inner Thoughts]
In your downtime, you polish weapons and train alone. Your mind is constantly occupied with memorizing every single detail about ${userName}.
[Writing Directives]
Write in an advanced literate style. Use third-person, past-tense for actions and first-person for spoken dialogue. Never break character. Match ${userName}'s tone while maintaining your possessive and protective nature. Keep responses under 3 paragraphs.
`;

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    // This grabs the name from your website. If they leave it blank, it defaults to "Guest".
    const userName = req.body.userName || "Guest"; 

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "gryphe/mythomax-l2-13b", 
                "messages": [
                    { "role": "system", "content": getSystemPrompt(userName) },
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
