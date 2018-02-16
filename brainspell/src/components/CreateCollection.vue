<template>
  <div>
    <b-container>
    <form-wizard title="Set up your new collection!"
                 subtitle="Provide the basic information to begin a Brainspell meta-analysis."
                 finishButtonText="Create!"
                 color="#5bc0de">
      <tab-content title="Collection"
                   icon="ti-gift">
        <p>What would you like to name your collection?
          <b-form-input v-model="name"
                  type="text"
                  placeholder="Collection name"></b-form-input>
        </p>
        <p>Please describe the purpose of this collection:
          <b-form-input v-model="description"
                  type="text"
                  placeholder="Collection description"></b-form-input>
        </p>
      </tab-content>
      <tab-content title="Inclusion Criteria"
                   icon="ti-thumb-up">
        <p>Enter your search string(s) here:
          <b-form-input v-model="searchString"
                  type="text"
                  placeholder="Separate strings with semicolons"></b-form-input>
        </p>
        <p>What are your criteria for study inclusion?
          <b-table striped hover :items="incCriteria" :fields="incFields" ref="incTable" small>

            <template slot="Inclusion" slot-scope="data">
              <textfield v-model="data.value" :index="data.index" v-on:input="setInclusion" ttype="text"></textfield>
            </template>
            <template slot="delete" scope="row">

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

            <template slot="Exclusion" slot-scope="data">
              <textfield v-model="data.value" :index="data.index" v-on:input="setExclusion" ttype="text"></textfield>
            </template>
            <template slot="delete" scope="row">

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
          <b-badge v-for="desc in descriptors" class="mr-1">{{desc}}</b-badge>
          <!-- the modal -->
          <b-modal size="lg" ref="descriptorsModal">
            <div slot="modal-header" class="w-100" style="display: inline">
              <b-input class="w-100" placeholder="Search Descriptors" v-model="tagSearch"></b-input>
            </div>
            <descriptors :selected="descriptors" v-on:setselected="setSelector" :filter="tagSearch"></descriptors>
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

</style>

<script>
import Descriptors from './Descriptors';
import Vue from 'vue';
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'ti-icons/css/themify-icons.css'

Vue.use(VueFormWizard)


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
  data() {
    return {
      incFields: ['Criteria', 'delete'],
      tagSearch: '',
      name: '',
      description: '',
      searchString: '',
      excFields: ['Criteria', 'delete'],
      excCriteria: '',
    };
  },
  components: {
    Textfield,
    Descriptors,
  },
  computed: {

  },
  methods: {
    name() {
      return this.name;
    },
    description() {
      return this.description;
    },
    searchString() {
      return this.searchString;
    },
    incCriteria() {
      return this.incCriteria;
    },
    removeInc(row) {
      this.incCriteria.splice(row.index, 1);
      this.$refs.incTable.refresh();
    },
    setInclusion(val, idx) {
      this.incCriteria[idx] = val;
    },
    addInclusion() {
      this.incCriteria.push({
        key: '',
      });
      this.$refs.incTable.refresh();
    },
    excCriteria() {
      return this.excCriteria;
    },
    removeExc(row) {
      this.excCriteria.splice(row.index, 1);
      this.$refs.excTable.refresh();
    },
    setExclusion(val, idx) {
      this.excCriteria[idx] = val;
    },
    addExclusion() {
      this.excCriteria.push({
        key: '',
      });
      this.$refs.incTable.refresh();
    },
    showDescriptors() {
      this.$refs.descriptorsModal.show();
    },
    setSelector(item) {
      console.log('recieved', item);
      const idx = this.exp.descriptors.indexOf(item.name);
      console.log('idx is', idx);
      if (idx >= 0) {
        // remove the descriptors
        this.exp.descriptors.splice(idx, 1);
      } else {
        this.exp.descriptors.push(item.name);
      }
      console.log(this.exp.descriptors);
      this.$forceUpdate();
    },
  },
  props: ['col', 'index'],
};
</script>
