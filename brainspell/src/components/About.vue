<template>
  <div id="about" class="pt-4">

    <h1> About MetaCurious </h1>
    <div class="container intro">
        <div class="row align-items-center pt-3">
            <div class="col-md-8 align-middle order-sm-2 order-1">
                <p>
                  The number of publications in neuroimaging is increasing exponentially,
                  and it is impossible to read and understand all the papers.

                  Quantitative meta-analyses efficiently summarize the main findings
                  in neuroimaging, allowing researchers to asses consensus in brain
                  activation patterns across many individual studies.

                  In order to do this, we need to collect metadata on our publications.
                </p>
                <p>
                  But descriptions of studies in PDF format are messy, and it is really
                  hard to separate the content into valuable nuggets of metadata <i>automatically</i>.
                  To do this on your own would take a very long time.
                  By collaborating we can get the answers in only a few days!
                </p>

            </div>
            <div class="col-md-4 order-sm-1 order-2">
                <img src="../assets/imgs/undraw_files.svg" class="undraw">
            </div>
        </div>
        <div class="row align-items-center pt-3">
            <div class="col-md-8 align-middle order-sm-2">
              <p>
	        MetaCurious is the tool to help you do prepare your
	        collection of articles for meta-analyses.  All the metadata needed to reproduce
	        the analysis is available and sharable. MetaCurious is a front end to Brainspell-neo,
		which started from Roberto Toro's <a href="http://www.brainspell.org/">Brainspell</a>, 
		itself based on Tal Yarkoni's <a href="http://www.NeuroSynth.org/">NeuroSynth</a>: 
		standing on the shoulders of <em> Giants</em>!
              </p>

                 <p>
                   You can collaborate on a collection through <a href="https://github.com">GitHub</a>.
                   Fork a collection on <a href="https://github.com">GitHub</a>,
                   annotate the paper and its experiments on metaCurious,
                   and send pull requests to your collaborators on <a href="https://github.com">GitHub</a>.
                 </p>

                <p>
		   If you're looking to get started using MetaCurious for your
		   projects, check out our <a href="#/userguide">User Guide</a>.
		   To contribute to MetaCurious development, look at our 
		   <a href="#/developerguide">developer documentation</a>.
                </p>
            </div>
            <div class="col-md-4 order-sm-1">
                <img src="../assets/imgs/undraw_data.svg" class="undraw">
            </div>
        </div>
    </div>

    <div class="container-fluid pt-5">
        <h3>Current Contributors:</h3>
        <table class="table table-responsive-sm table-borderless">
            <thead></thead>
            <tbody>
                <tr>
                    <td>
                        <img src="https://avatars1.githubusercontent.com/u/14095475?s=400&v=4" class="rounded-circle" width="95px" alt="Katie">
                    </br>
                        Katie Bottenhorn
                    </td>
                    <td>
                        <img src="https://avatars2.githubusercontent.com/u/15017191?s=460&v=4" class="rounded-circle" width="95px" alt="Elizabeth">
                    </br>
                        Elizabeth DuPre
                    </td>
                    <td>
                        <img src="https://avatars0.githubusercontent.com/u/972008?s=400&v=4" class="rounded-circle" width="95px" alt="Anisha">
                    </br>
                        Anisha Keshavan
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src="https://avatars0.githubusercontent.com/u/4883288?s=460&v=4" class="rounded-circle" width="95px" alt="Anisha">
                    </br>
                        Greg Kiar
                    </td>
                    <td>
                        <img src="https://archive.org/download/HYPhD_Jean-Baptiste-Poline_17-09-2014/HYPhD_Jean-Baptiste-Poline_17-09-2014.jpg" class="rounded-circle" width="95px" alt="JB">
                    </br>
                        Jean-Baptiste Poline
                    </td>
                    <td>
                        <img src="https://media.licdn.com/dms/image/C5603AQFEaNjB_wP0jQ/profile-displayphoto-shrink_200_200/0?e=1533168000&v=beta&t=fLHuRP9jJn0_8aiNsyuGYA08gN2dp9VILKR8LLsEo6o" class="rounded-circle" width="95px" alt="Sharabesh">
                    </br>
                        Sharabesh Ramesh
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src="https://media.licdn.com/dms/image/C5603AQEdxjjxvrMBwg/profile-displayphoto-shrink_200_200/0?e=1533168000&v=beta&t=G7XSPCp0ZZ11BbLoS-Q7GcobiXl3uEmtDM4pEspquyY" class="rounded-circle" width="95px" alt="Neel">
                    </br>
                        Neel Somani
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
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

.table-borderless td,
.table-borderless th {
    border: 0;
}

.profile {
    width: "95px";
}

.undraw {
    width: 100%;
}

.order-2 {
  order: 2 !important;
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
