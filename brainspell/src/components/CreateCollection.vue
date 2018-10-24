<template>
  <div>
    <b-modal ref="completeModalRef" hide-footer  no-close-on-backdrop hide header centered>
      <template slot="modal-title" v-if="loading">Your collection is being created...</template>
      <template slot="modal-title" v-if="!loading">Your collection has been created!</template>
      <span v-if="loading">
        <p>
          Your collection will be located at:
        </p>
      </span>
      <span v-if="!loading">
        <span v-if="yay">
          <p>
            Your collection lives at
          </p>
        </span>
        <span v-if="!yay">
          <p id="erroneous">{{this.errors}}</p>
        </span>
      </span>
      <a href="#" id="linkToCollection" target="_blank">
        github.com/{{userInfo.login}}/brainspell-neo-collection-{{this.name}}
      </a><br>
      <span v-if="!loading">
        <span v-if="yay=false">
          <img class="failure" src="../assets/imgs/undraw_taken_yju1.svg"/>
          <p>It seems your creation has been abducted by aliens.</p>
        </span>
        <img class="success" src="../assets/imgs/undraw_gift1_sgf8.svg"/>
        <p>
          <br>
          <b-btn variant="outline-info" float-left @click="toCollections">See all collections</b-btn>
          <b-btn variant="outline-primary" float-right @click="hideModal">Back to home</b-btn>
      </p></span>
      <span v-else>
        <br>
        <i class="fa fa-spinner fa-pulse fa-2x"></i><br>
      </span>
    </b-modal>
    <b-container>
    <form-wizard title="Set up your new collection!"
                 subtitle="Provide the basic information to begin curating a collection with metaCurious."
                 finishButtonText="Create!"
                 color="#5bc0de"
                 @on-complete="submit">
      <tab-content title="Collection"
                   icon="ti-gift">
        <p>What would you like to name your collection?
          <b-form-input v-model="name"
                  type="text"
                  placeholder="Avoid using 'brainspell-neo' in your collection name" required></b-form-input>
        </p>
        <p>Please describe the purpose of this collection:
          <b-form-input v-model="description"
                  type="text"
                  placeholder="Collection description"></b-form-input>
        </p>
      </tab-content>

      <!--NEXT TAB-->
      <tab-content title="Search(es)"
                     icon="ti-search">
        <!--<p>Enter any PMIDList you may have from a previous search here:
          <b-form-input
                  type="text"
                  placeholder="Separate PMIDList with spaces" v-on:input="splitPmids"></b-form-input>
        </p>-->
        <p>Enter your search string(s) and corresponding PMIDs here:
          <p>
            <b-table striped hover :items="spPairs" :fields="spFields" ref="spTable" small>

              <template slot="SearchString" slot-scope="data">
                <textfield v-model="data.value" :index="data.index" v-on:input="setSearch" ttype="text"></textfield>
              </template>
              <template slot="PMIDList" slot-scope="data">
                <textfield v-model="data.value" :index="data.index" v-on:input="setPmid" ttype="text"></textfield>
              </template>
              <template slot="delete" slot-scope="row">

                <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeSP(row)">
                  <span aria-hidden="true">&times;</span>
                </button>

              </template>

            </b-table>
            <b-button size="sm" variant="outline-secondary" @click="addSProw">Add search</b-button>
          </p><!--this works-->

          <!--<b-table striped hover :items="searchStr" :fields="searchFields" ref="searchTable" small>

            <template slot="Search string" slot-scope="data">
              <textfield v-model="data.value" :index="data.index" v-on:input="setSearchStr" ttype="text"></textfield>
            </template>

            <template slot="delete" slot-scope="row">

              <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeSearch(row)">
                <span aria-hidden="true">&times;</span>
              </button>

            </template>

          </b-table>
          <b-button size="sm" variant="outline-secondary" @click="addSearchStr">Add search string</b-button>-->
        </p>
      </tab-content>
      <tab-content title="Inclusion &amp; Exlcusion Criteria"
                   icon="ti-settings">
       <p>What are your criteria for study inclusion?
         <b-table striped hover :items="incCriteria" :fields="incFields" ref="incTable" small>

           <template slot="Criteria" slot-scope="data">
             <textfield v-model="data.value" :index="data.index" v-on:input="setInclusion" ttype="text"></textfield>
           </template>

           <template slot="delete" slot-scope="row">

             <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeInc(row)">
               <span aria-hidden="true">&times;</span>
             </button>

           </template>

         </b-table>
         <b-button size="sm" variant="outline-secondary" @click="addInclusion">Add inclusion criterion</b-button>
       </p>
        <p>What are your criteria for study exclusion?
          <b-table striped hover :items="excCriteria" :fields="excFields" ref="excTable" small>

            <template slot="Criteria" slot-scope="data">
              <textfield v-model="data.value" :index="data.index" v-on:input="setExclusion" ttype="text"></textfield>
            </template>

            <template slot="delete" slot-scope="row">

              <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeExc(row)">
                <span aria-hidden="true">&times;</span>
              </button>

            </template>

          </b-table>
          <b-button size="sm" variant="outline-secondary" @click="addExclusion">Add exclusion criterion</b-button>
        </p>
      </tab-content>
      <tab-content title="Tags"
                   icon="ti-tag">
        <p>Select any/all relevant tags for you collection:
          <b-badge v-for="desc in this.descriptors" :key="desc" class="mr-1">{{desc}}</b-badge>
          <!-- the modal -->
          <b-modal size="lg" ref="descriptorsModal">
            <div slot="modal-header" class="w-100" style="display: inline">
              <b-input class="w-100" placeholder="Search Descriptors" v-model="tagSearch"></b-input>
            </div>
            <descriptors :selected="this.descriptors" v-on:setselected="setSelector" :filter="tagSearch"></descriptors>
          </b-modal>
          <br>
          <b-btn size="sm" variant="outline-secondary" @click="showDescriptors">Open Descriptors</b-btn>
        </p>
      </tab-content>
    </form-wizard>
  </b-container>
  </div>
</template>

<style>
  .textfield {
    border-style: none;
    background-color: #ffffff00;
    width: 100%;
    text-align: center;
  }
  .success {
    height: 15em;
  }
</style>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueFormWizard from 'vue-form-wizard';
import qs from 'simple-query-string';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import 'ti-icons/css/themify-icons.css';
import Descriptors from './Descriptors';


Vue.use(VueFormWizard);

const Textfield = {
  props: ['value', 'placeholder', 'index', 'ttype'],
  template: `
  <div>
    <input class="textfield" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-if="ttype=='text'">
    <textarea class="textfield text-left" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-else></textarea>
  </div>
  `,
  methods: {
    onInput(e) {
      const value = e.target.value;
      // Add this line
      this.$emit('input', value, this.index);
    },
    getPlaceholder() {
      if (!this.value && this.placeholder) {
        return this.placeholder;
      }
      return '';
    },
  },
};
export default {
  name: 'collection',
  props: ['isAuthenticated', 'auth_tokens', 'userInfo', 'hostname'],
  data() {
    return {
      incFields: ['Criteria', 'delete'],
      excFields: ['Criteria', 'delete'],
      // searchFields: ['Criteria', 'delete'],
      tagSearch: '',
      name: '',
      description: '',
      incCriteria: [],
      excCriteria: [],
      descriptors: [],
      // searchStr: [],
      spFields: ['SearchString', 'PMIDList', 'delete'],
      spPairs: [],
      // pmids: [],
      loading: true,
      yay: false,
      errors: '',
    };
  },
  components: {
    Textfield,
    Descriptors,
  },
  computed: {
  },
  methods: {
    removeSP(row) {
      this.spPairs.splice(row.index, 1);
      this.$refs.spTable.refresh();
    },
    setSearch(val, idx) {
      this.spPairs[idx].SearchString = val;
    },
    splitPmids(val) {
      // console.log(val.split(" "));
      const pmidArray = val.split(' ');
      this.pmids = pmidArray;
    },
    setPmid(val, idx) {
      this.spPairs[idx].PMIDList = val;
    },
    addSProw() {
      this.spPairs.push({
        SearchString: '',
        PMIDList: '',
      });
      this.$refs.spTable.refresh();
    },
    removeInc(row) {
      this.incCriteria.splice(row.index, 1);
      this.$refs.incTable.refresh();
    },
    setInclusion(val, idx) {
      this.incCriteria[idx].Criteria = val;
    },
    addInclusion() {
      this.incCriteria.push({
        Criteria: '',
      });
      this.$refs.incTable.refresh();
    },
    removeExc(row) {
      this.excCriteria.splice(row.index, 1);
      this.$refs.excTable.refresh();
    },
    setExclusion(val, idx) {
      this.excCriteria[idx].Criteria = val;
    },
    addExclusion() {
      this.excCriteria.push({
        Criteria: '',
      });
      this.$refs.excTable.refresh();
    },
    showDescriptors() {
      this.$refs.descriptorsModal.show();
    },
    setSelector(item) {
      // console.log('recieved', item);
      const idx = this.descriptors.indexOf(item.name);
      // console.log('idx is', idx);
      if (idx >= 0) {
        // remove the descriptors
        this.descriptors.splice(idx, 1);
      } else {
        this.descriptors.push(item.name);
      }
      // console.log(this.descriptors);
      this.$forceUpdate();
    },
    convertURL(user, col) {
      const colRoot = '/brainspell-neo-collection-'
      document.getElementById('linkToCollection').href = 'https://github.com/' + user + colRoot + col;
    },
    convertObjects(thing) {
      const l = [];
      thing.forEach((v) => {
        l.push(v.Criteria);
      });
      return l;
    },
    convertSearch(thing) {
      const q = [];
      thing.forEach((v) => {
        q.push(v.SearchString);
      });
      return q;
    },
    convertPmids(thing) {
      const z = [];
      thing.forEach((v) => {
        z.push(v.PMIDList);
      });
      return z;
    },
    toCollections() {
      this.$refs.completeModalRef.hide();
      this.$emit('updateCollection');
      this.$router.replace("/profile");
    },
    submit() {
      const search_map = {}

      this.spPairs.forEach((v) => {
        search_map[v.SearchString] = v.PMIDList.trim().split(' ');
      });
      console.log('search map is', search_map);
      const querystring2 = qs.stringify({
        collection_name: this.name,
        github_token: this.auth_tokens.github_access_token,
        key: this.auth_tokens.api_key,
        search_to_pmids: search_map,
      });
      // after this works
      const querystring = qs.stringify({
        inclusion_criteria: JSON.stringify(this.convertObjects(this.incCriteria)),
        exclusion_criteria: JSON.stringify(this.convertObjects(this.excCriteria)),
        collection_name: this.name,
        description: this.description,
        // search_strings: JSON.stringify(this.convertObjects(this.searchStr)),
        tags: JSON.stringify(this.descriptors),
        github_token: this.auth_tokens.github_access_token,
        key: this.auth_tokens.api_key });
      // const help = `https://brainspell.herokuapp.com/json/v2/create-collection?github_token=${this.auth_tokens.github_access_token}&inclusion_criteria=${JSON.stringify(this.incCriteria)}&exclusion_criteria=${JSON.stringify(this.excCriteria)}&collection_name=${this.name}&description=${this.description}&search_strings=${JSON.stringify(this.searchStr)}&tags=${JSON.stringify(this.descriptors)}&key=${this.auth_tokens.api_key}`
      // console.log(querystring);
      axios.post(`${this.hostname}/json/v2/create-collection?${querystring}`)
        .then(() => {
          // console.log('resp is', response);
          axios.post(`${this.hostname}/json/v2/add-to-collection?${querystring2}`).then((resp2) => {
            console.log('resp2', resp2);
            this.loading = false;
            this.yay = true;
          })
          .catch(function(error) {
            this.errors = error.message;
            console.log('error is', error);
          });
          this.convertURL(this.userInfo.login, this.name);
        })
        .catch(function (error) {
          if (error.response) {
            // Found at https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
            // Because I'm still trying to work out this whole post/response/error thing
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
          this.errors = error.message;
          this.yay = false;
        })
// this is the old error catching, the above is probably better, but I didn't want to throw this out just in case
//        .catch(function(error) {
//          this.loading = false;
//          this.yay = false;
//          this.errors = error.message;
//          console.log('error is', error);
//        });
      this.$refs.completeModalRef.show();
    },
    showModal () {
      this.$refs.completeModalRef.show()
    },
    hideModal () {
      this.$refs.completeModalRef.hide();
      this.$router.replace("/")
    },
  },
};
</script>
