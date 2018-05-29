<template>
  <div id="about" class="pt-4">

    <h1> About MetaCurious </h1>
    <div class="container intro">
        <div class="row align-items-center pt-3">
            <div class="col-md-8 align-middle">
                <p>
                    MetaCurious is the tool to help you do prepare your collection of articles for meta-analyses.
                    No more "what was the exact exclusion / inclusion criteria for this meta-analysis"?
                    All the metadata needed to reproduce the analysis should be available and sharable.
                </p>
            </div>
            <div class="col-md-4">
                <img src="../assets/imgs/undraw_files.svg" class="undraw">
            </div>
        </div>
        <div class="row align-items-center pt-3">
            <div class="col-md-8 align-middle">
                <p>
            	    This project started with Brainspell (by Roberto Toro, building on NeuroSynth) a long time ago ... and then evolved to be specifically tuned for neuroimaging meta-analyses.
                    It's now a collaborative, _______ tool for conducting and sharing meta-analyses.
            	</p>
            </div>
            <div class="col-md-4">
                <img src="../assets/imgs/undraw_collab.svg" class="undraw">
            </div>
        </div>
        <div class="row align-items-center pt-3">
            <div class="col-md-8 align-middle">
                <p>
                    If you're looking to get started using MetaCurious for your projects, check out our <a href="#/userguide">User Guide</a>.
                    To contribute to MetaCurious development, look at our <a href="#/developerguide">developer documentation</a>.
                </p>
            </div>
            <div class="col-md-4">
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
                        <img src="https://archive.org/download/HYPhD_Jean-Baptiste-Poline_17-09-2014/HYPhD_Jean-Baptiste-Poline_17-09-2014.jpg" class="rounded-circle" width="95px" alt="JB">
                    </br>
                        Jean-Baptiste Poline
                    </td>
                    <td>
                        <img src="https://media.licdn.com/dms/image/C5603AQFEaNjB_wP0jQ/profile-displayphoto-shrink_200_200/0?e=1533168000&v=beta&t=fLHuRP9jJn0_8aiNsyuGYA08gN2dp9VILKR8LLsEo6o" class="rounded-circle" width="95px" alt="Sharabesh">
                    </br>
                        Sharabesh Ramesh
                    </td>
                    <td>
                        <img src="https://media.licdn.com/dms/image/C5603AQEdxjjxvrMBwg/profile-displayphoto-shrink_200_200/0?e=1533168000&v=beta&t=G7XSPCp0ZZ11BbLoS-Q7GcobiXl3uEmtDM4pEspquyY" class="rounded-circle" width="95px" alt="Neel">
                    </br>
                        Neel Somani
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
