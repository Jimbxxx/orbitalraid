const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { command, serverId, userId, timestamp } = req.body;

    if (!command || !serverId || !userId || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const FILE_PATH = 'stats.txt';

    try {
        // Get the current stats.txt content
        let sha = null;
        let existingContent = '';
        try {
            const response = await axios.get(
                `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
                {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            existingContent = Buffer.from(response.data.content, 'base64').toString('utf8');
            sha = response.data.sha;
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                throw error;
            }
        }

        // Append new entry
        const newEntry = `User ID: ${userId}, Command: ${command}, Server ID: ${serverId}, Timestamp: ${timestamp}\n`;
        const updatedContent = existingContent + newEntry;

        // Update stats.txt in GitHub
        await axios.put(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
            {
                message: `Append command from ${userId}`,
                content: Buffer.from(updatedContent).toString('base64'),
                sha: sha,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        res.status(200).json({ message: 'Stats logged successfully' });
    } catch (error) {
        console.error('Error logging stats:', error);
        res.status(500).json({ error: 'Failed to log stats' });
    }
};
