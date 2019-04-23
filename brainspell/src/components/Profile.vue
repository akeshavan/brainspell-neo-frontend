<template>
  <div id="profile" class="container">
    <!-- Only show stuff is the user is authenticated -->

      <!-- userInfo is a prop that was passed in from App -->
      <div v-if="isAuthenticated">
        <h1>
          <img :src="userInfo.avatar_url" class="img img-thumbnail avatar rounded-circle"> {{userInfo.login}}'s Collections </img>
        </h1>
        <button v-on:click="forcePullCollections" class="btn btn-info">Force Pull From Github</button>

        <p class="lead mt-3">
          <p v-if="pendingCollection || showSpinner" class="lead">Gathering your collections</p>
          <i v-if="pendingCollection || showSpinner" class="fa fa-spinner fa-pulse fa-3x"></i>
        </p>

        <div v-show="!showSpinner" role="tablist">
          <b-card no-body class="mb-1" v-for="(coll, index) in allCollections" :key="index">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle="'accordion'+index" variant="default">{{coll.name}}</b-btn>
            </b-card-header>
            <b-collapse :id="'accordion'+index" :visible='coll == currentCollection' accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text text-left" v-if="coll.unmapped_articles.length">
                  <div v-for="c in coll.unmapped_articles" class="mt-2 mb-2 pb-2 pt-2 text-left">
                    <p class="text-left mb-0 pb-0">
                      <router-link :to="'/view-article/'+c.pmid">{{c.title}}</router-link>
                    </p>
                    <small class="text-muted text-left">{{c.reference}}</small>
                  </div>
                  <div v-for="c in coll.mapped_articles" class="mt-2 mb-2 pb-2 pt-2 text-left">
                    <p class="text-left mb-0 pb-0">
                      <router-link :to="'/view-article/'+c.pmid">{{c.title}}</router-link>
                    </p>
                    <small class="text-muted text-left">{{c.reference}}</small>
                  </div>
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

      </div>

      <div v-else>
        Log in to see your collections!
      </div>

  </div>
</template>

<style>
#profile {
  margin-top: 40px;
}

.avatar {
  width: 50px;
}
</style>



<script>
export default {
  name: 'profile',
  data() {
    return {
      showSpinner: false,
    };
  },
  methods: {
    forcePullCollections: async function() {
      this.showSpinner = true;
      let resp = await axios.get(`${this.hostname}/json/v2/get-user-collections?key=${this.auth_tokens.api_key}&github_token=${this.auth_tokens.github_access_token}&contributors=0&cache=0`);
      this.$emit('updateCollection');
      this.showSpinner = false;
    }
  },
  // the parent component feeds these vars to this component
  props: ['userInfo', 'isAuthenticated', 'allCollections',
    'pendingCollection', 'currentCollection', 'auth_tokens', 'hostname'],
};
</script>
