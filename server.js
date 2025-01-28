const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Scrape Blogger Template XML
app.get('/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the blog HTML
    const { data: html } = await axios.get(url);

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Find the template XML
    const templateXml = $('head > link[rel="EditURI"]').attr('href');

    if (!templateXml) {
      return res.status(404).json({ error: 'Template XML not found' });
    }

    // Fetch the template XML
    const { data: xml } = await axios.get(templateXml);
    res.json({ xml });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
