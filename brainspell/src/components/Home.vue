<template>
  <div class="home container mt-3">
    <div class="">
      <h1>{{msg}}</h1>
      <p class="lead">
        An open, human-curated classification of neuroimaging literature.
      </p>

      <p class="search">
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

      </p>

      <b-container>
        <p class="muted">
          <small> Randomly selected articles <i class="fa fa-spinner fa-pulse" v-if="randomPending"></i> </small>
        </p>
        <b-row v-for="article in articles" class="mt-2 mb-2">
          <p class="article">
            <router-link :to="'/view-article/' + article.id">
              {{article.title}}
            </router-link>
            <small>{{article.authors}}</small>
          </p>
        </b-row>
      </b-container>

    </div>

  </div>


</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      msg: 'Brainspell',
      query: null,
      articles: [],
      randomPending: true,
    };
  },
  mounted() {
    this.randomQuery();
  },
  methods: {
    doSearch(e) {
      if (this.query) {
        e.preventDefault();
        console.log('searching', this.query);
        this.$router.push(`/search/${this.query}`);
      }
    },
    randomQuery() {
      axios.get('https://brainspell.herokuapp.com/json/random-query').then((res) => {
        console.log('result is', res);
        this.articles = res.data.articles;
        this.randomPending = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.home {
  text-align: left;
}

.home h1 {
  text-align: center;
}

.buttons {
  text-align: center;
}

.landing {
  background-color: white;
}

.lead {
  text-align: center;
}

.white {
  color: white;
}

.article a {
  display: block;
}

</style>
