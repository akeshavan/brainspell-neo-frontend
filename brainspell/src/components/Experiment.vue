<template>
  <div class="experiment">
    <h3> Experiment {{index + 1 }}</h3>

    <p>
      <small>Caption</small>
      <textfield v-model="exp.caption" placeholder="Enter Caption" ttype="textarea"></textfield>
    </p>

    <p>
      <small>Contrast</small>
      <textfield v-model="exp.contrast" placeholder="Enter Contrast Name" ttype="text"></textfield>
    </p>

    <small>Include or Exclude this experiment?</small>
    <b-form-group>
      <b-form-radio-group buttons
                          v-model="include"
                          button-variant="outline-primary"
                          size="sm"
                          :options="includeOptions"
                          />
  </b-form-group>

  <small>Specify the coordinate space</small>
  <b-form-group>
    <b-form-radio-group buttons
                        v-model="space"
                        button-variant="outline-info"
                        size="sm"
                        :options="spaceOptions"
                        />
  </b-form-group>

  <small>What kind of effect size (E)?</small>
  <b-form-group>
    <b-form-radio-group buttons
                        v-model="effect"
                        button-variant="outline-success"
                        size="sm"
                        :options="effectOptions"
                        />
  </b-form-group>

  <small>Descriptors/Tags</small>
  <p>
    <b-badge v-for="desc in exp.descriptors" class="mr-1">{{desc}}</b-badge>
    <!-- the modal -->
    <b-modal size="lg" ref="descriptorsModal">
      <div slot="modal-header" class="w-100" style="display: inline">
        <b-input class="w-100" placeholder="Search Descriptors"></b-input>
      </div>
      <descriptors :selected="exp.descriptors" v-on:setselected="setSelector"></descriptors>
    </b-modal>
    <br>
    <b-btn size="sm" variant="outline-secondary" @click="showDescriptors">Open Descriptors</b-btn>
  </p>

  <small>Key-Value pairs</small>
  <p>
    <b-table striped hover :items="kvPairs" :fields="kvFields" ref="kvTable" small>

      <template slot="key" slot-scope="data">
        <textfield v-model="data.value" :index="data.index" v-on:input="setKey" ttype="text"></textfield>
      </template>
      <template slot="value" slot-scope="data">
        <textfield v-model="data.value" :index="data.index" v-on:input="setValue" ttype="text"></textfield>
      </template>
      <template slot="delete" scope="row">

        <button type="button" class="close" aria-label="Close" style="width:100%" @click="removeKV(row)">
          <span aria-hidden="true">&times;</span>
        </button>

      </template>

    </b-table>
    <b-button size="sm" variant="outline-secondary" @click="addKVrow">Insert KV Pair</b-button>
  </p>


      <b-table striped hover :items="exp.locations" class="pb-3">
        <template slot="x" slot-scope="data">
          <textfield v-model="data.value" :index="data.index" v-on:input="setX" ttype="text"></textfield>
        </template>
        <template slot="y" slot-scope="data">
          <textfield v-model="data.value" :index="data.index" v-on:input="setY" ttype="text"></textfield>
        </template>
        <template slot="z" slot-scope="data">
          <textfield v-model="data.value" :index="data.index" v-on:input="setZ" ttype="text"></textfield>
        </template>
        <template slot="E" slot-scope="data">
          <textfield v-model="data.value" :index="data.index" v-on:input="setE" ttype="text"></textfield>
        </template>

      </b-table>

      <hr class="mb-3 mt-3 pt-3 pb-3">
  </div>
</template>

<style>
  .textfield {
    border-style: none;
    background-color: #ffffff00;
    width: 100%;
    text-align: center;
  }

  /*.textfieldWide {
    width: auto;
  }*/
</style>

<script>
import Descriptors from './Descriptors';
import Vue from 'vue';

const Textfield = {
  props: ['value', 'placeholder', 'index', 'ttype'],
  template: `
  <div>
    <input class="textfield" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-if="ttype=='text'">
    <textarea class="textfield text-center" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-else></textarea>
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
  name: 'experiment',
  data() {
    return {
      atlases: [],
      include: true,
      includeOptions: [
        { text: 'Include', value: true },
        { text: 'Exclude', value: false },
      ],
      space: 'MNI',
      spaceOptions: [
        { text: 'MNI', value: 'MNI' },
        { text: 'Talairach', value: 'Talairach' },
        { text: 'Other', value: 'Other' },
        { text: 'Unknown', value: 'Unknown' },
      ],
      effect: 'Z',
      effectOptions: [
        { text: 'Z', value: 'Z' },
        { text: 'T', value: 'T' },
        { text: 'F', value: 'F' },
        { text: 'r', value: 'r' },
        { text: 'p exact', value: 'p' },
        { text: 'p < value', value: 'p<' },
      ],
      kvFields: ['key', 'value', 'delete'],
    };
  },
  components: {
    Textfield,
    Descriptors,
  },
  computed: {

  },
  methods: {
    kvPairs() {
      return this.exp.kvPairs;
    },
    removeKV(row) {
      this.exp.kvPairs.splice(row.index, 1);
      this.$refs.kvTable.refresh();
    },
    setX(val, idx) {
      this.exp.locations[idx].x = val;
    },
    setY(val, idx) {
      this.exp.locations[idx].y = val;
    },
    setZ(val, idx) {
      this.exp.locations[idx].z = val;
    },
    setE(val, idx) {
      this.exp.locations[idx].E = val;
    },
    setKey(val, idx) {
      this.exp.kvPairs[idx].key = val;
    },
    setValue(val, idx) {
      this.exp.kvPairs[idx].value = val;
    },
    addKVrow() {
      this.exp.kvPairs.push({
        key: '',
        value: '',
      });
      this.$refs.kvTable.refresh();
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
  props: ['exp', 'index'],
};
</script>
