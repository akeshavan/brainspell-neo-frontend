<template>
  <!-- This is a dynamic route
    Source: https://scotch.io/tutorials/getting-started-with-vue-router
  -->

  <div class="content mt-3">
    <div v-bind:class="{'fullpage': !viewArticle, 'halfpage left': viewArticle}">
      <b-container>

        <b-row class="mt-3 text-center">
          <h2 class="w-100">{{info.title}}</h2>
          <p class="authors text-center text-muted">{{info.authors}}</p>
        </b-row>

        <b-row>
          <div class="w-100 text-right">
            <label>Open Browser</label>
            <input type="checkbox" v-model="viewArticle"></input>
          </div>

          <b-form class="mb-3 w-100">
            <b-button variant="success">Add to Collection</b-button>
          </b-form>

        </b-row>

        <b-row>



          <p class="abstract text-justify">
            {{info.abstract}}
          </p>

          <p>
            <a :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + this.pmid">PubMed</a>
          </p>
          <br>
          <p class="text-center w-100">
            <b-form>
              <label>Number of Subjects</label>
              <b-input class="w-25 mx-auto"></b-input>
            </b-form>
          </p>
        </b-row>
        <hr class="mb-3 mt-3 pt-3 pb-3">

        <b-row style="display: block;" class="mt-3">

          <div v-for="(exp, index) in info.experiments" class="experiment-list mt-3">
            <experiment :index="index" :exp="exp" v-on:newexp="addExp"></experiment>
          </div>

        </b-row>

      </b-container>
    </div>
    <div v-bind:class="{'nowidth': !viewArticle, 'right': viewArticle}">
      <b-input v-model="articleURL"></b-input>
      <small>Copy/Paste a URL to PDF here</small>
      <iframe :src="articleURL" v-if="articleURL" class="iframe"></iframe>
    </div>
</div>

</template>

<style>
  .content, html, body {
      height: 90%;
  }
  .left {
      float: left;
      width: 50%;
      padding: 5px;
      height: calc(100vh - 80px);
      max-height: calc(100vh - 80px);
      overflow: scroll;
  }
  .right {
      float: left;
      width: 50%;
      height: calc(100vh - 80px);
      max-height: calc(100vh - 80px);
      overflow: scroll;
  }
</style>

<style>

  .authors {
    width: 100%;
  }

  .experiment-list {
    display: block;
  }

  .experiment {
    display: block;
  }

  .fullpage {
    width: 100%;
  }

  .iframe {
    width: 100%;
    height: 100%;
    border-style: none;
  }

  .nowidth {
    width: 0 !important;
    height: 0 !important;
    visibility: hidden;
  }
</style>


<script>
  import axios from 'axios';
  import Experiment from './Experiment';

  export default {
    name: 'ViewArticle',

    data() {
      return {
        pmid: null,
        info: {
          experiments: [],
        },
        viewArticle: false,
        articleURL: null,
      };
    },

    components: { Experiment },

    created() {
      this.fetchData();
    },

    watch: {
      $route: 'fetchData',
    },

    methods: {
      addExp(locations, index) {
        console.log('adding new experiment at', index);
        this.info.experiments.splice(index+1, 0, { locations, kvPairs: [], descriptors: [] });
      },
      fetchData() {
        this.pmid = this.$route.params.id;
        axios.get(`https://brainspell.herokuapp.com/json/article?pmid=${this.$route.params.id}`)
        .then((resp) => {
          this.info = resp.data;
          this.articleURL = `http://dx.doi.org/${this.info.doi}`;
          this.info.experiments = JSON.parse(this.info.experiments);
          this.info.metadata = JSON.parse(this.info.metadata);
          this.info.experiments.forEach((exp, idx, arr) => {
            if (!arr[idx].kvPairs) {
              arr[idx].kvPairs = [];
            }
            if (!arr[idx].descriptors) {
              arr[idx].descriptors = [];
            }
            arr[idx].locations.forEach((loc, jdx, locarr) => {
              if (typeof loc === 'string' || loc instanceof String){
                const locs = loc.split(',')
                locarr[jdx] = { x: locs[0],
                  y: locs[1],
                  z: locs[2],
                  E: locs[3],
                };
              }
            });
          });
        })
        .catch((e) => {
          console.log('ERROR', e);
        });
      },
    },
  };
</script>
