<template>
  <div id="app" class="page-container">
    <md-app>
      <md-app-toolbar>
        <h1 class="md-title" style="flex: 1">Rap Fails Maker</h1>
        <div class="md-flex">
          <md-field md-inline>
            <label>Song</label>
            <md-input v-model="song"></md-input>
          </md-field>
        </div>
        <div class="md-flex">
          <md-field md-inline>
            <label>Artist</label>
            <md-input v-model="artist"></md-input>
          </md-field>
        </div>
        <md-button @click="newProject" class="md-primary"> New </md-button>
      </md-app-toolbar>

      <md-app-content class="md-layout">
        <md-card class="md-layout-item md-size-45 md-small-size-100">
          <md-card-header>
            <div class="md-title">Lyrics</div>
          </md-card-header>

          <md-card-content>
            <a v-if="url" :href="url">{{song}} {{artist}}</a>
          </md-card-content>
        </md-card>

        <md-card class="md-layout-item md-size-45 md-small-size-100">
          <md-card-header>
            <div class="md-title">Config</div>
          </md-card-header>

          <form @submit.prevent="saveConfig">
            <md-card-content>
              <div v-if="embed_url">
                <iframe
                  width="892"
                  height="502"
                  :src="embed_url"
                  frameborder="0"
                  allow="autoplay"
                  allowfullscreen
                ></iframe>
                <md-divider></md-divider>
              </div>
              <md-field>
                <label>Original lyrics</label>
                <md-textarea
                  required
                  v-model.trim="original_lines"
                  md-autogrow
                ></md-textarea>
              </md-field>
              <md-field>
                <label>Modified lyrics</label>
                <md-textarea
                  required
                  v-model.trim="modified_lines"
                  md-autogrow
                ></md-textarea>
              </md-field>
              <md-field>
                <label>Start time</label>
                <md-input
                  required
                  v-model="start_seconds"
                  placeholder="xx:xx.xx"
                ></md-input>
              </md-field>
              <md-field>
                <label>End Time</label>
                <md-input
                  required
                  v-model="end_seconds"
                  placeholder="xx:xx.xx"
                ></md-input>
              </md-field>
              <md-field>
                <label>Iteration</label>
                <md-input
                  required
                  v-model.number="iteration"
                  type="number"
                  placeholder="1"
                ></md-input>
              </md-field>
              <md-field>
                <label>Cover Image url</label>
                <md-input
                  required
                  v-model="img_url"
                  placeholder="Image url: http://genius.com/____.jpg"
                ></md-input>
              </md-field>
              <md-switch v-model="shorten">Shorten</md-switch>
              <md-switch v-model="outro">Contains outro</md-switch>
            </md-card-content>
            <md-card-actions>
              <md-button type="submit" class="md-primary" :disabled="saving">
                Save
              </md-button>
            </md-card-actions>
          </form>
        </md-card>

        <md-snackbar :md-active.sync="saving">
          Sucessfully created.
        </md-snackbar>
        <md-snackbar :md-active.sync="connectionError">
          Connection error. Try to refresh the page.
        </md-snackbar>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data: () => ({
    song: null,
    artist: null,
    original_lines: null,
    modified_lines: null,
    start_seconds: null,
    end_seconds: null,
    iteration: 1,
    outro: null,
    shorten: null,
    img_url: null,

    url: null,
    id: null,

    connectionError: false,
    saving: false,
  }),
  computed: {
    embed_url() {
      if (this.id !== null) return `https://www.youtube.com/embed/${this.id}?autoplay=1`;
      return undefined;
    },
  },
  async mounted() {
    return 0;
  },
  methods: {
    save(filename, data) {
      const blob = new Blob([data], { type: 'text/json' });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    },
    async apiPost(endpoint, payload) {
      try {
        return (await axios.post(`/api/${endpoint}`, payload)).data;
      } catch (err) {
        console.error(err);
        this.connectionError = true;
        throw err;
      }
    },
    timeStampToSeconds(t) {
      const a = t.split(':');
      return a[0] * 60 + parseFloat(a[1]);
    },
    async saveConfig() {
      console.log(this.start_seconds, this.end_seconds);
      const startSeconds = this.timeStampToSeconds(this.start_seconds);
      const endSeconds = this.timeStampToSeconds(this.end_seconds);

      const results = await this.apiPost('image', {
        img_url: this.img_url,
      });
      const { b64Img } = results;

      const config = {
        song: this.song,
        artist: this.artist,
        original_lines: this.original_lines,
        modified_lines: this.modified_lines,
        start_seconds: startSeconds,
        end_seconds: endSeconds,
        iteration: this.iteration,
        shorten: this.shorten,
        outro: this.outro,
        b64_img: b64Img,
      };
      const extension = this.iteration > 1 ? `_${this.iteration}` : '';
      this.save(`${this.song}_${this.artist}${extension}.json`, JSON.stringify(config));
    },
    async newProject() {
      const results = await this.apiPost('info', {
        title: this.song,
        artist: this.artist,
      });
      this.url = results.url;
      this.id = results.id;

      window.open(this.url);
    },
  },
};
</script>

<style>
ul {
  padding: 0;
  margin: 0;
}
</style>
