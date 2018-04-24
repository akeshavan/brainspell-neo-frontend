<template>
  <b-container id="game">
    <span v-if="randomPending || !abstracts.length">Hold on...</span>
    <div v-else class="text-justify" v-html="abstract">

    </div>
    <div class="mt-3">
      <b-btn variant="primary" @click="next">
        <span v-if="N"> Submit {{N}} </span>
        <span v-else> Next </span>
      </b-btn>
    </div>
  </b-container>
</template>

<style>
  #game {
    margin-top: 40px;
  }

  .nl-Value {
    color: #dc3545;
    cursor: pointer;
    background-color: #ffc1075e;
    padding: 3px;
    border-style: solid;
    border-color: #ffc1075e;
    border-radius: 5px;
    border-width: thin;
  }

  .selectedNumber {
    border-width: thick;
    border-color: #dc3545;
  }

</style>

<script>
  import axios from 'axios';
  import nlp from 'compromise';
  import Vue from 'vue';

  window.nlp = nlp;
  export default {
    data() {
      return {
        articles: [],
        randomPending: true,
        currentIdx: 0,
        abstracts: [],
        N: 0,
      };
    },
    watch: {
      abstract() {
        const self = this;
        this.$nextTick(() => {
          const numbers = document.getElementsByClassName('nl-Value');
          for (let i = 0; i < numbers.length; i += 1) {
            numbers[i].onclick = function recordNum(e) {
              const classNames = e.target.className;
              const N = parseInt(nlp(e.target.innerHTML).values().toNumber().out());
              if (classNames.indexOf('selectedNumber') < 0) {
                self.N += N;
                e.target.classList.add('selectedNumber');
              } else {
                e.target.classList.remove('selectedNumber');
                self.N -= N;
              }
            };
          }
        });
      },
    },
    computed: {
      abstract() {
        if (this.abstracts.length) {
          const r = nlp(this.abstracts[this.currentIdx]);
          return r.out('html');
          /* console.log(r.values().toNumber().out('array'));
          if (r.if('#Value').found) {
            return r.if('#Value').out('html');
          }
          return this.abstracts[this.currentIdx]; */
        }
        return null;
      },
    },
    methods: {
      next() {
        this.N = 0;
        if (this.currentIdx === 4) {
          this.randomQuery();
        } else {
          this.currentIdx += 1;
        }
      },
      randomQuery() {
        this.randomPending = true;
        this.currentIdx = 0;
        axios.get('https://brainspell.herokuapp.com/json/random-query').then((res) => {
          console.log('result is', res);
          this.articles = res.data.articles;
        }).then(() => {
          const abstracts = [];
          this.articles.forEach((val) => {
            axios.get(`https://brainspell.herokuapp.com/json/article?pmid=${val.id}`).then((resp) => {

              abstracts.push(resp.data.abstract);
            });
          });
          this.randomPending = false;
          this.abstracts = abstracts;
        });
      },
    },
    created() {
      this.randomQuery();
    },
  };
</script>
