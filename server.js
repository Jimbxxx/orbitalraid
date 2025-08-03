import express from 'express';
import cors from 'cors';
import { Client, GatewayIntentBits } from 'discord.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Setup middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON bodies

// Create Discord client with intents to access guild info
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Log in Discord client
client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log('Discord bot logged in.');
  })
  .catch(err => {
    console.error('Failed to login Discord bot:', err);
  });

// API endpoint to check if bot is in a server by ID
app.post('/check-server', (req, res) => {
  const { serverId } = req.body;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is required in the request body.' });
  }

  try {
    // Check if the bot is in the guild with that ID
    const guild = client.guilds.cache.get(serverId);

    if (guild) {
      res.json({
        inServer: true,
        serverName: guild.name,
        serverId: guild.id,
        memberCount: guild.memberCount,
      });
    } else {
      res.json({
        inServer: false,
        message: 'Bot is not in the specified server.'
      });
    }
  } catch (error) {
    console.error('Error checking server membership:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
