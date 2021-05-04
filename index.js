const express = require('express');
const compression = require('compression');
const cors = require('cors');
const yts = require('yt-search');
const genius = require('genius-lyrics-api');
const axios = require('axios');

const API_KEY = process.env.GENIUS_KEY;

// initialize express app
const app = express();
const FACTORY_URL = process.env.FACTORY_URL || 'http://127.0.0.1:3334';
const port = process.env.PORT || 3333;

app.use(cors());

// configure middlewares
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicAdminRoot = 'dist';
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: publicAdminRoot });
});
app.use(express.static(publicAdminRoot));

const router = express.Router();
router.post('/info', async (req, res) => {
  try {
    const { artist } = req.body;
    const { title } = req.body;
    const options = {
      apiKey: API_KEY,
      title,
      artist,
      optimizeQuery: false,
    };
    const { url } = (await genius.searchSong(options))[0];

    const { videos } = await yts(`${artist} ${title}`);
    const id = videos[0].videoId;

    res.json({ url, id });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post('/image', async (req, res) => {
  try {
    const imgUrl = req.body.img_url;

    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    const b64Img = Buffer.from(response.data, 'binary').toString('base64');

    res.json({ b64Img });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post('/generate', async (req, res) => {
  try {
    await axios.post(`${FACTORY_URL}/api/video`, req.body);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Maker listening on port ${port}`);
});
