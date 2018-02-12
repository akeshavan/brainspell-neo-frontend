<template>
  <!-- This is a dynamic route
    Source: https://scotch.io/tutorials/getting-started-with-vue-router
  -->
  <!--<div class="">
    <div class="special">
      <div v-bind:class="{'fullpage': !viewArticle, 'halfpage left': viewArticle}">
        <h1>Brainspell</h1>
        <p class="lead">
          An open, human-curated classification of neuroimaging literature.
        </p>

        <div>

          <input type="checkbox" v-model="viewArticle"></input>

        </div>


        <b-container>

          <b-form class="mb-3">
            <b-label>Add to GitHub Collections</b-label>
            <b-input></b-input>
          </b-form>

          <b-row class="mt-3">
            <h2>{{info.title}}</h2>
          </b-row>

          <b-row>

            <p class="authors text-center text-muted">{{info.authors}}</p>

            <p class="abstract text-justify">
              {{info.abstract}}
            </p>

            <p>
              <a :href="'https://www.ncbi.nlm.nih.gov/pubmed/' + this.pmid">PubMed</a>
            </p>
          </b-row>

          <b-row style="display: block;">

            <div v-for="(exp, index) in info.experiments" class="experiment-list">
              <div class="experiment">
                <h3> Experiment {{index}}</h3>
                <p>

                </p>
                <p>Exclusion popup</p>
              </div>
            </div>

          </b-row>

        </b-container>
      </div>
      <div v-if="viewArticle" class="mt-3 halfpage artView right">
        <b-input v-model="articleURL"></b-input>
        <iframe :src="articleURL" v-if="articleURL" class="iframe"></iframe>
      </div>
    </div>
  </div>-->

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
        </b-row>

        <b-row style="display: block;">

          <div v-for="(exp, index) in info.experiments" class="experiment-list">
            <div class="experiment">
              <h3> Experiment {{index}}</h3>
              <p>

              </p>
              <p>Exclusion popup</p>
            </div>
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

  export default {
    name: 'ViewArticle',

    data() {
      return {
        pmid: null,
        info: {},
        viewArticle: false,
        articleURL: null,
      };
    },

    created() {
      this.fetchData();
    },

    watch: {
      $route: 'fetchData',
    },

    methods: {
      fetchData() {
        this.pmid = this.$route.params.id;
        axios.get(`https://brainspell.herokuapp.com/json/article?pmid=${this.$route.params.id}`)
        .then((resp) => {
          this.info = resp.data;
          this.articleURL = `http://dx.doi.org/${this.info.doi}`;
          this.info.experiments = JSON.parse(this.info.experiments);
        })
        .catch((e) => {
          console.log('ERROR', e);
        });
      },
    },
  };
</script>
