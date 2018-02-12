<template>
  <div id="about">
    <h1> About </h1>

    This is a new route on the client.

    Here is a vue variable: {{count}}
  </div>

</template>

<style>
</style>

<script>
export default {
  name: 'about',
  data() {
    return {
      count: 1,
    };
  },
};
</script>
