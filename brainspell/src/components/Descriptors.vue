<template>
  <div>
    <div class="input-group col-md-12">
      
    </div>
    <ul class="list-group">

        <li :class="{'list-group-item tag': selected.indexOf(atlas.name) < 0, 'list-group-item tag selected': selected.indexOf(atlas.name) >= 0}"
             v-if="!atlas.superClass"
             v-for="atlas in atlases"
             @click="sendClick(atlas)"
        >
          {{atlas.name}}
        </li>
        <h6 v-else class="mt-2">{{atlas.name}}</h6>

    </ul>
  </div>
</template>

<style>
.tag {
    display: inline-block;
    cursor: pointer;
    padding: 3px;
    border-radius: 5px;
    margin: 2px;
    font-size: 0.8em;
    width: fit-content;
}

.tag:hover {
  background-color: steelblue !important;
  color: white;
}

.selected {
  background-color: black !important;
  color: white;
}

.list-group-item {
    position: relative;
    display: inline-block;
    padding: 5px 5px;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid #ddd;
}

.list-group {
    padding-left: 0;
    margin-bottom: 20px;
    display: inline;
}

#custom-search-input {
    padding: 3px;
    border: solid 1px #E4E4E4;
    border-radius: 6px;
    background-color: #fff;
}

</style>

<script>
import cogcog from '../atlases/cogatlas-cognitive';
import cogbeh from '../atlases/cogatlas-tasks';
import bmap from '../atlases/brainmap-behavioral';

export default {
  name: 'descriptors',
  data() {
    return {
      atlases: [],
      initSelected: this.selected,
    };
  },
  props: ['selected'],
  methods: {
    sendClick(item) {
      this.$emit('setselected', item);
    },
    isSelected(atlas) {
      // console.log('checking', atlas);
      return this.selected.indexOf(atlas.name) >= 0;
    },
  },
  computed: {
    selectedDesc() {
      console.log('currentSelected', this.selected);
      return this.selected
    },
    nowSelected() {
      return this.selected.length;
    },
  },
  created() {
    this.atlases = this.atlases.concat(cogcog);
    this.atlases = this.atlases.concat(cogbeh);
    this.atlases = this.atlases.concat(bmap);
  },
};
</script>
