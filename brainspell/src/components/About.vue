<template>
  <div id="about" class="pt-4">

    <h1> About Brainspell </h1>
    <div class="container intro">
	<p>
	    Brainspell-neo is the tool to help you do prepare your collection of articles for meta-analyses.
	    No more "what was the exact exclusion / inclusion criteria for this meta-analysis"?
	    All the metadata needed to reproduce the analysis should be available and sharable.
        Also, do you need to collaborate?
        Brainspell-neo is there for you.
	</p>
    <p>
	    This project started with Brainspell (by Roberto Toro, building on NeuroSynth) a long time ago ... and then evolved to be specifically tuned for neuroimaging meta-analyses.
        A lot of work was done on the backend by Neel and Sharabesh at Berkeley, and a lot of work was done on the front end by Anisha and Katie, and more are now joining and making sure that this is going to be useful.
	</p>
    <p>
        If you're looking to get started using Brainspell for your projects, check out our <a href="#/userguide">User Guide</a>.
        To contribute to Brainspell development, look at our <a href="#/developerguide">developer documentation</a>.
    </p>
    </div>

    <div class="container">
        <!-- <h3>Contributors:</h3> -->
        <table class="table">
            <thead></thead>
            <tbody>
                <tr>
                    <td>
                        <img src="https://avatars1.githubusercontent.com/u/14095475?s=400&v=4" class="img" alt="Katie">
                    </br>
                        Katie Bottenhorn
                    </td>
                    <td>Elizabeth DuPre</td>
                    <td>Anisha Keshavan</td>
                </tr>
                <tr>
                    <td>Jean-Baptiste Poline</td>
                    <td>Sharabesh Ramesh</td>
                    <td>Neel Somani</td>
                </tr>
            </tbody>
        </table>
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
  name: 'about',
  data() {
    return {
      count: 1,
    };
  },
};
</script>
