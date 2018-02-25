<template>
  <!-- This is a dynamic route
    Source: https://scotch.io/tutorials/getting-started-with-vue-router
  -->

  <div class="content mt-3">
    <div v-if="!info.title">
      Loading... <i class="fa fa-spinner fa-pulse fa-3x"</i>
    </div>
    <div v-bind:class="{'fullpage': !viewArticle, 'halfpage left': viewArticle}" v-else>
      <b-container>

        <b-row class="mt-3 text-center">
          <h2 class="w-100">{{info.title}}</h2>
          <p class="authors text-center text-muted">{{info.authors}}</p>
        </b-row>

        <b-row>
          <div class="w-100 text-right">
            <label>View Full Article
              <span v-if="!articlePDF" v-b-tooltip.hover title="Not Open Access!">
                <i class="fa fa-exclamation-triangle"></i>
              </span>
            </label>
            <input type="checkbox" v-model="viewArticle"></input>
          </div>

          <b-form class="mb-3 w-100" v-if="isAuthenticated">
            <b-button variant="outline-secondary" disabled v-if="!currentCollection">
              <i class="fa fa-spinner fa-pulse"></i> Loading your collections
            </b-button>
            <b-button variant="success" v-if="!isInCollection && currentCollection" :disabled="addPending  || pendingCollection" @click="addToCollection">
              <i class="fa fa-spinner fa-pulse" v-if="addPending  || pendingCollection"></i>
              <i class="fa fa-plus" v-else></i>

               Add to {{currentCollection.name}}
            </b-button>
            <b-button variant="danger" v-if = "isInCollection && currentCollection">
              Exclude from {{currentCollection.name}}
            </b-button>
            <!--<small> TO do: when you click exclude, explain why</small>-->
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
  import _ from 'lodash';

  export default {
    name: 'ViewArticle',
    props: ['currentCollection', 'isAuthenticated', 'auth_tokens', 'pendingCollection'],
    data() {
      return {
        pmid: null,
        info: {
          experiments: [],
        },
        viewArticle: false,
        articleURL: null,
        articlePDF: null,
        addPending: false,
      };
    },

    computed: {
      isInCollection() {
        if (this.currentCollection) {
          const exists = _.filter(this.currentCollection.contents, v => v.pmid === this.pmid);
          console.log(exists);
          return exists.length;
        }
        return 0;
      },
    },

    components: { Experiment },

    created() {
      this.fetchData();
    },

    watch: {
      $route: 'fetchData',
    },

    methods: {
      addToCollection() {
        console.log('sending request...')
        this.addPending = true;
        axios.get(`https://brainspell.herokuapp.com/json/add-to-collection?github_access_token=${this.auth_tokens.github_access_token}&key=${this.auth_tokens.api_key}&pmid=${this.pmid}&name=${this.currentCollection.name}`)
          .then((resp) => {
            console.log('success, added', resp);
            this.addPending = false;
            this.$emit('updateCollection');
          }).catch((e) => {
            console.log('error on add', e);
          })
      },
      addExp(locations, index) {
        console.log('adding new experiment at', index);
        this.info.experiments.splice(index+1, 0, { locations, kvPairs: [], descriptors: [] });
      },
      setArticleURL(doi){
        axios.get(`https://api.oadoi.org/v2/${doi}?email=test@example.com`)
          .then((resp) => {
            console.log('resp is', resp);
            if (resp.data.best_oa_location && resp.data.best_oa_location.url_for_pdf){
              this.articleURL = resp.data.best_oa_location.url_for_pdf;
              this.articlePDF = true;
            } else {
              this.articleURL = resp.data.doi_url;
              this.articlePDF = false;
            }
          });
      },
      fetchData() {
        this.pmid = this.$route.params.id;
        axios.get(`https://brainspell.herokuapp.com/json/article?pmid=${this.$route.params.id}`)
        .then((resp) => {
          this.info = resp.data;
          // this.articleURL = `http://dx.doi.org/${this.info.doi}`;
          this.setArticleURL(this.info.doi);
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
