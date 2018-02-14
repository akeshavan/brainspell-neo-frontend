<template>
  <div id="search">
    <b-container>
      <p class="muted">
        <small> {{this.query}} </small>
      </p>
      <b-row v-for="article in articles" class="mt-2 mb-2">
        <p class="articleSearch">
          <router-link :to="'/view-article/' + article.id">
            {{article.title}}
          </router-link>
          <small>{{article.authors}}</small>
        </p>
      </b-row>
      <b-row>
        <b-btn variant="outline-primary" class="mb-3" @click="incrementPage" v-if="!end">
          <span v-if="!loading">Next</span>
          <i class="fa fa-spinner fa-pulse" v-else></i>
        </b-btn>
      </b-row>
    </b-container>
  </div>
</template>

<style>
.article a {
  display: block;
}

.articleSearch {
  text-align: left;
}
</style>

<script>
import axios from 'axios';

export default {
  name: 'search',
  data() {
    return {
      articles: [],
      query: null,
      start: 0,
      end: false,
      loading: true,
    };
  },
  created() {
    this.query = this.$route.params.query;
    this.loading = true;
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      axios.get(`https://brainspell.herokuapp.com/json/query?q=${this.$route.params.query}&start=${this.start}`).then((resp) => {
        this.articles = this.articles.concat(resp.data.articles);
        if (resp.data.articles.length !== 10) {
          this.end = true;
        }
        this.loading = false;
      });
    },
    incrementPage() {
      this.start += 10;
      this.fetchData();
    },
  },
};
</script>
