<template>
  <div id="search">
    <b-container>
      <form class="form" v-on:submit="doSearch">
        <div class="input-group">
           <input type="text" name="q" style="width:80%" v-model="query" placeholder="Search articles by title, author, keyword..." class="form-control">
           <select name="req" id="req" class="selectpicker form-control" style="width: 10%;">
                <option selected value="t" id="default">Title, author, abstract</option>
                <option value="x" id="experiments">Experiments</option>
                <option value="p" id="pmid">PubMed ID</option>
                <option value="r" id="reference">Reference</option>
           </select>
           <span class="input-group-btn">
                <!--<input type="submit" class="btn btn-default" value="Search" />-->
                <b-button variant="primary" @click="doSearch"> Search </b-button>
           </span>
           <p>
             <small> Use [au] for author, [ALL] for all fields, [MH] for mesh descriptors, [PMID] for pubmed ID, [TIAB] for title/abstract search. </small>
           </p>
        </div>
     </form>

      <b-row v-for="(article, index) in articles" class="mt-2 mb-2" :key="index">
        <p class="articleSearch">
          <router-link :to="'/view-article/' + article.id">
            {{article.title}}
          </router-link>
          <small>{{article.authors}}</small>
        </p>
      </b-row>
      <b-row v-if="!articles.length">
        No Articles Found
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
.articleSearch a {
  display: block;
}

.articleSearch {
  text-align: left;
}

#search {
  margin-top: 40px;
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
    doSearch(e) {
      e.preventDefault();
      if (this.query) {
        // console.log('searching', this.query);
        this.$router.push(`/search/${this.query}`);
        this.articles = [];
        this.fetchData();
      }
    },
    incrementPage() {
      this.start += 10;
      this.fetchData();
    },
  },
};
</script>
