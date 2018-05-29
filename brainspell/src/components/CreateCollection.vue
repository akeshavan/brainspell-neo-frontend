<template>
  <div>
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
                  placeholder="Collection name" required></b-form-input>
        </p>
        <p>Please describe the purpose of this collection:
          <b-form-input v-model="description"
                  type="text"
                  placeholder="Collection description"></b-form-input>
        </p>
        <p>Enter any PMIDs you may have from a previous search here:
          <b-form-input
                  type="text"
                  placeholder="Separate PMIDs with spaces" v-on:input="splitPmids"></b-form-input>
        </p>
        <p>Enter your search string(s) here:
          <b-table striped hover :items="searchStr" :fields="searchFields" ref="searchTable" small>

            <template slot="Criteria" slot-scope="data">
              <textfield v-model="data.value" :index="data.index" v-on:input="setSearchStr" ttype="text"></textfield>
            </template>

            <template slot="delete" slot-scope="row">

              <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeSearch(row)">
                <span aria-hidden="true">&times;</span>
              </button>

            </template>

          </b-table>
          <b-button size="sm" variant="outline-secondary" @click="addSearchStr">Add search string</b-button>
        </p>
      </tab-content>
      <tab-content title="Inclusion Criteria"
                   icon="ti-thumb-up">
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
      </tab-content>
      <tab-content title="Exclusion Criteria"
                   icon="ti-thumb-down">
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
  props: ['isAuthenticated', 'auth_tokens'],
  data() {
    return {
      incFields: ['Criteria', 'delete'],
      excFields: ['Criteria', 'delete'],
      searchFields: ['Criteria', 'delete'],
      tagSearch: '',
      name: '',
      description: '',
      incCriteria: [],
      excCriteria: [],
      descriptors: [],
      searchStr: [],
      pmids: [],
    };
  },
  components: {
    Textfield,
    Descriptors,
  },
  computed: {
  },
  methods: {
    splitPmids(val) {
      // console.log(val.split(" "));
      const pmidArray = val.split(' ');
      this.pmids = pmidArray;
    },
    setSearchStr(val, idx) {
      this.searchStr[idx].Criteria = val;
    },
    removeSearch(row) {
      this.searchStr.splice(row.index, 1);
      this.$refs.searchTable.refresh();
    },
    addSearchStr() {
      this.searchStr.push({
        Criteria: '',
      });
      this.$refs.incTable.refresh();
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
    convertObjects(thing) {
      const l = [];
      thing.forEach((v) => {
        l.push(v.Criteria);
      });
      return l;
    },
    submit() {
      const querystring = qs.stringify({
        inclusion_criteria: JSON.stringify(this.convertObjects(this.incCriteria)),
        exclusion_criteria: JSON.stringify(this.convertObjects(this.excCriteria)),
        collection_name: this.name,
        description: this.description,
        search_strings: JSON.stringify(this.convertObjects(this.searchStr)),
        tags: JSON.stringify(this.descriptors),
        github_token: this.auth_tokens.github_access_token,
        key: this.auth_tokens.api_key });
      // const help = `https://brainspell.herokuapp.com/json/v2/create-collection?github_token=${this.auth_tokens.github_access_token}&inclusion_criteria=${JSON.stringify(this.incCriteria)}&exclusion_criteria=${JSON.stringify(this.excCriteria)}&collection_name=${this.name}&description=${this.description}&search_strings=${JSON.stringify(this.searchStr)}&tags=${JSON.stringify(this.descriptors)}&key=${this.auth_tokens.api_key}`
      // console.log(querystring);
      axios.post(`https://brainspell.herokuapp.com/json/v2/create-collection?${querystring}`)
        .then(() => {
          // console.log('resp is', response);
        })
        .catch(() => {
          // console.log('error is', error);
        });
    },
  },
  handleErrorMsg() {
    if (this.name == null) {
      // alert('Please give your collection a name.')
    }
  },
};
</script>
