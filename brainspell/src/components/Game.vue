<template>
  <b-container id="game">
    <h4>Click on the sample size</h4>
    <small>hit Next if the information isn't available</small>

    <div v-if="randomPending || !abstracts.length">

      <b-alert show>Hold On ... getting more abstracts</b-alert>

    </div>
    <div v-else class="text-justify mt-3" v-html="abstract">

    </div>
    <div class="mt-3">
      <b-btn variant="primary" @click="next">
        <span v-if="N"> Submit {{N}} </span>
        <span v-else> Next </span>
      </b-btn>
      <b-input v-model="N" class="mt-3 mx-auto text-center" style="width:50px" label="manual"></b-input>
      <small> Manual Input </small>
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
        if (this.currentIdx === this.abstracts.length - 1) {
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
          this.abstracts = [];
          this.articles.forEach((val) => {
            axios.get(`https://brainspell.herokuapp.com/json/article?pmid=${val.id}`).then((resp) => {
              const html = nlp(resp.data.abstract);
              console.log('html is', html.if('#Value').found);
              if (html.if('#Value').found) {
                this.abstracts.push(resp.data.abstract);
              }
            });
          });

          if (!this.abstracts.length) {
            console.log('nothing??');
            // this.randomQuery();
          }
          this.randomPending = false;
        });
      },
    },
    created() {
      this.randomQuery();
    },
  };
</script>
