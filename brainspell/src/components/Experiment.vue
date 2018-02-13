<template>
  <div class="experiment">
    <h3> Experiment {{index + 1 }}</h3>

    <p>
      <textfield v-model="exp.caption" placeholder="Enter Caption" ttype="textarea"></textfield>
    </p>

    <p>
      <small>Contrast</small>
      <textfield v-model="exp.contrast" placeholder="Enter Contrast Name" ttype="text"></textfield>
    </p>

    <b-form-group>
      <b-form-radio-group buttons
                          v-model="include"
                          button-variant="outline-primary"
                          size="sm"
                          :options="includeOptions"
                          />
  </b-form-group>



    <template>
      <b-table striped hover :items="exp.locations">
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
    </template>

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

const Textfield = {
  props: ['value', 'placeholder', 'index', 'ttype'],
  template: `
  <div>
    <input class="textfield" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-if="ttype=='text'">
    <textarea class="textfield text-justify" :value="value" :placeholder="getPlaceholder()" v-on:input="onInput" v-else>
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
      include: true,
      includeOptions: [
        { text: 'Include', value: true },
        { text: 'Exclude', value: false },
      ],
    };
  },
  components: {
    Textfield,
  },
  computed: {

  },
  methods: {
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

  },
  props: ['exp', 'index'],
};
</script>
