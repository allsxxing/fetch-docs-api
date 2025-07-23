const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-guidelines', async (req, res) => {
  const { platform_name, doc_url } = req.body;

  try {
    const response = await axios.get(doc_url);
    const $ = cheerio.load(response.data);

    const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);
    const summary = `📘 ${platform_name} Docs Summary:\n\n${text}`;

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse the documentation.' });
  }
});

app.listen(3000, () => console.log('✅ API running on port 3000'));
