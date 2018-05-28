<template>
  <div id="developer-guide" class="pt-3">
    <h1> Developer Guide </h1>
    <div class="container-fluid intro">
        <p>
            This is a guide for developing Brainspell.
            You'll need to have the JavaScript package manager <a href="https://www.npmjs.com/get-npm"> npm</a> installed.
        </p>
    </div>

  </div>

</template>

<style>
    .intro {
        text-align: left;
        padding: 1.5em 0 0 3em;
    }

</style>

<script>
export default {
  name: 'developer-guide',
  data() {
    return {
      count: 1,
    };
  },
};
</script>
