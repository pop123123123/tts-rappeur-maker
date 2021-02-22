const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const yts = require('yt-search');
const genius = require('genius-lyrics-api');

const env = process.env.NODE_ENV || 'development'
const API_KEY = process.env.GENIUS_KEY

// initialize express app
const app = express()
const port = process.env.PORT || 3333

app.use(cors())

// configure middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const publicAdminRoot = 'dist'
app.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: publicAdminRoot })
})
app.use(express.static(publicAdminRoot))


const router = express.Router()
router.post('/info', async (req, res) => {
  try {
    const artist = req.body.artist;
    const title = req.body.title;
    const options = {
      apiKey: API_KEY,
      title,
      artist,
      optimizeQuery: true,
    };
    const lyrics = await genius.getLyrics(options);


    const videos = (await yts(`${artist} ${title}`)).videos;
    const id = videos[0].videoId;

    res.json({ lyrics, id })
  } catch (err) {
    console.error(err)
    res.status(500).send()
  }
})

app.use('/api', router)

app.listen(port, () => {
  console.log('Maker listening on port ' + port)
})
