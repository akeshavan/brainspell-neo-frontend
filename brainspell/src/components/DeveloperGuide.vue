<template>
  <div id="developer-guide" class="pt-4">

    <h1> Developer Guide </h1>
    <div class="container intro">
        <p>
            This is a guide for developing the MetaCurious frontend.
            MetaCurious is coded in  <a href="https://getbootstrap.com/" target="_blank">Bootstrap</a>, <a href="https://vuejs.org/" target="_blank">Vue.js</a>, and <a href="https://bootstrap-vue.js.org/" target="_blank">Bootstrap-Vue</a>.
            For a general guide on getting started with these frameworks, see their documentation!
        </p>
        <p>
            Before you start, you'll need to have the JavaScript package manager <a href="https://www.npmjs.com/get-npm" target="_blank"> npm</a> installed.
            You can then <code>git clone</code> and install the current <a href="https://github.com/akeshavan/brainspell-neo-frontend" target="_blank">master branch of the repository</a>.
            The code to do so might be:
            <div class="container-fluid"><pre id="code"><code>
                git clone https://github.com/akeshavan/brainspell-neo-frontend
                cd brainspell-neo-frontend/brainspell
                npm install
                npm run dev
            </code></pre></div>
            Then, in your browser, navigate to <code>http://localhost:8080</code>.
            You should see the main home page for MetaCurious:
        </p>
        <img src="../assets/imgs/homepage.jpg" class="img-fluid" alt="homepage">
        <p>
            Any changes you make to the code should now appear in your loaded window.
        </p>
    </div>

  </div>
</template>

<style>
    .intro {
        text-align: left;
        padding: 1.5em 3em 0 3em;
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
  mounted() {
    document.getElementById('code').scrollTo(113,0);
  },
};
</script>
