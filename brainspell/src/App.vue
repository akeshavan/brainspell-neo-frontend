<template>
  <div id="app">
    <!-- The Navbar below stays constant throughout the app.
         We've set up links on the navbar to different "routes",
         like the "Home" page and "About" page.

         There is also a right-aligned link to Login with GitHub.
         When logged in, this shows the username with a dropdown menu
         to see the profile or logout.
    -->
    <b-navbar toggleable="md" type="dark" variant="dark" sticky>

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">metaCurious.</b-navbar-brand>

      <!-- If the viewport is small, the navbar collapses.
          Everything in b-collapse is what gets collapsed.
      -->
      <b-collapse is-nav id="nav_collapse">

        <!--  Here are links to different routes  -->
        <b-navbar-nav>
          <b-nav-item to="/" exact>Home</b-nav-item>
          <b-nav-item to="/game">Play</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto" v-show="$route.path.indexOf('/view-article') == 0">
          <b-nav-form>
            <b-button variant="info" size="sm" class="my-2 my-sm-0" :disabled="!canEdit" @click="doSave">

              <span v-b-tooltip.hover title="Add this article to your collection to save changes" v-if="!canEdit">
                <i class="fa fa-exclamation-triangle" v-if="needsSave"></i> Save Changes
              </span>

              <span v-else>
                <i class="fa fa-exclamation-triangle" v-if="needsSave"></i> Save Changes
              </span>

            </b-button>
          </b-nav-form>
        </b-navbar-nav>



        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- This part only displays if the user is authenticated -->

          <b-dropdown id="ddown-split" right split v-if="isAuthenticated && allCollections && !pendingCollection" class="m-2" @click="gotoProfile">
            <template slot="button-content" v-if="currentCollection">

              <em>{{currentCollection.name}}</em>
            </template>

            <b-dropdown-item v-for="(coll, index) in allCollections"
              v-if="coll.name != currentCollection.name"
              @click="setCollection(index)"
            >
              {{coll.name}}
            </b-dropdown-item>

            <b-dropdown-item to="/createcollection" v-if="currentCollection">
              <i class="fa fa-plus"></i> Create Collection
            </b-dropdown-item>

          </b-dropdown>

          <b-nav-item v-if="pendingCollection && isAuthenticated">
            <i class="fa fa-spinner fa-pulse fa-1x"></i>
          </b-nav-item>

          <b-nav-item to="/createcollection" v-if="isAuthenticated && !currentCollection"><i class="fa fa-plus"></i> Create Collection</b-nav-item>

          <b-nav-item-dropdown right v-if="isAuthenticated">
            <template slot="button-content">
              <em>{{userInfo.login}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- The login option shows if the user is not authenticated -->

          <b-nav-item v-else to="/login">Login</b-nav-item>



        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <!-- The content is in the router view -->


    <div class="router">
      <router-view :userInfo="userInfo" :isAuthenticated="isAuthenticated"
        :currentCollection="currentCollection" :auth_tokens="auth_tokens"
        :allCollections="allCollections"
        v-on:updateCollection="updateCollections"
        :pendingCollection="pendingCollection"
        v-on:setEdit="setEdit"
        v-on:needsSave="setSave"
        v-on:doLogin="authenticate"
        ref="routerView"
        />
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import pathJoin from 'path.join';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import auth from './lib/auth';

// explicit installation required in module environments

Vue.use(BootstrapVue);


export default {
  name: 'app',
  data() {
    return {
      allUsers: [],
      isAuthenticated: false,
      auth_tokens: {
        github_access_token: null,
        api_key: null,
      },
      userInfo: {
        username: null,
      },
      currentIdx: 0,
      allCollections: [],
      pendingCollection: true,
      canEdit: false,
      needsSave: false,
    };
  },

  computed: {
    currentCollection() {
      return this.allCollections[this.currentIdx];
    },
  },
  methods: {
    gotoProfile() {
      this.$router.replace('/profile')
    },
    authenticate() {
      const self = this;
      auth.login(() => {
        self.getUserInfo();
      });
    },
    setCollection(idx) {
      this.currentIdx = idx;
    },
    updateCollections() {
      const token = auth.getToken();
      const key = auth.getKey();
      // Get the user's collections
      console.log('updating collections');
      this.pendingCollection = true;
      axios.get(`https://brainspell.herokuapp.com/json/collections?key=${key}&github_access_token=${token}&pmid=1`)
           .then((resp) => {
             this.allCollections = resp.data.collections;
             this.allCollections.forEach((coll, idx) => {
               console.log('collection contents', coll.contents);
               Vue.set(this.allCollections[idx], 'contents', coll.contents);
             });
             this.pendingCollection = false;
           });
    },
    setEdit(val) {
      this.canEdit = val;
    },
    setSave(val) {
      this.needsSave = val;
    },
    doSave() {
      console.log('the current route is', this.$route);
      console.log('the info is', JSON.stringify(this.$refs.routerView.info));
      const data = this.$refs.routerView.info;
      axios.post(`https://brainspell.herokuapp.com/json/article?pmid=${data.pmid}`,
        data)
        .then((resp) => {
          console.log('response is', resp);
        }).catch((e) => {
          console.log('error', e);
        });
    },
    getUserInfo() {
      const token = auth.getToken();
      const key = auth.getKey();
      this.auth_tokens.github_access_token = token;
      this.auth_tokens.api_key = key;
      const self = this;
      // TODO: CHANGE THIS TO YOUR SERVER
      // In this example, we are getting user info from github
      // If this fails, then our token is bad; we are NOT authenticated and
      // should be logged out
      console.log('fetching user info');
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
        },
      }).then((resp) => {
        self.isAuthenticated = true;
        // TODO: do stuff here, like setting user info variables
        self.userInfo = resp.data;
      }).then(() => {
        this.updateCollections();
      }).catch(() => {
        self.logout();
      });
    },
    logout() {
      this.isAuthenticated = false;
      auth.logout();
    },
  },

  created() {
    this.getUserInfo();
  },
};
</script>

<style>
  /*
    You can style your component here. Since this is a top level componentm
    the styles follow into child components.
  */
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .router {
    /*padding-top: 40px;*/
  }

  .inline {

  }

</style>
