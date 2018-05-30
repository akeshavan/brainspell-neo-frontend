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

      <b-navbar-brand href="/" style="font-family: 'Lobster Two'">metaCurious.</b-navbar-brand>

      <!-- If the viewport is small, the navbar collapses.
          Everything in b-collapse is what gets collapsed.
      -->
      <b-collapse is-nav id="nav_collapse">

        <!--  Here are links to different routes  -->
        <b-navbar-nav>
          <b-nav-item to="/" exact>Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
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
        <div class="navbar-collapse justify-content-end">
          <!-- This part only displays if the user is authenticated -->

      <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-if="pendingCollection && isAuthenticated">
            <i class="fa fa-spinner fa-pulse fa-1x"></i>
          </li>

          <li class="nav-item" v-if="isAuthenticated && !currentCollection"> <a href="#/createcollection"><i class="fa fa-plus m-2" size="sm"></i>Create Collection</a></li>

          <!-- The login option shows if the user is not authenticated -->
          <li class="nav-item" v-else><a href="#/login">Login</a></li>
      </ul>

      <b-dropdown id="ddown-split1" variant="outline-white" size="sm" right split v-if="isAuthenticated && allCollections.length && !pendingCollection" class="m-2" @click="gotoProfile">

        <template slot="button-content" v-if="currentCollection">

          {{currentCollection.name}}
        </template>

        <b-dropdown-item v-for="(coll, index) in allCollections"
          :key="index"
          v-if="coll.name != currentCollection.name"
          @click="setCollection(index)"
        >
          {{coll.name}}
        </b-dropdown-item>

        <b-dropdown-item to="/createcollection" v-if="currentCollection">
          <i class="fa fa-plus"></i> Create Collection
        </b-dropdown-item>

      </b-dropdown>

      <b-dropdown id="ddown-split2" variant="outline-info" class="m-2" size="sm" right split v-if="isAuthenticated" @click="gotoProfile">
        <template slot="button-content">
          <em>{{userInfo.login}}</em>
        </template>
        <!-- <b-dropdown-item to="/profile">Profile</b-dropdown-item> -->
        <b-dropdown-item @click="logout">Signout</b-dropdown-item>
      </b-dropdown>
      </div>

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
      this.$router.replace('/profile');
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
      this.pendingCollection = true;
      axios.get(`https://brainspell.herokuapp.com/json/v2/get-user-collections?key=${key}&github_token=${token}&contributors=1`)
           .then((resp) => {
             this.allCollections = resp.data.collections;
             this.allCollections.forEach((coll, idx) => {
               /* eslint-disable */
               coll.name = coll.name.replace('brainspell-neo-collection-', '');
               /* eslint-enable */
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
      const data = this.$refs.routerView.info;
      axios.post(`https://brainspell.herokuapp.com/json/article?pmid=${data.pmid}`,
        data);
        /* .then((resp) => {
          // console.log('response is', resp);
        }).catch((e) => {
          // console.log('error', e);
        }); */
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
      // console.log('fetching user info');
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
  @import url('https://fonts.googleapis.com/css?family=Lobster+Two:700');
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .dropdown-menu.dropdown-menu-right.show {
    width: fit-content;
  }
  .btn-outline-white {
    color: #b0b1b2 !important;
    background-color: transparent !important;
    background-image: none !important;
    border-color: #b0b1b2 !important;
  }

  .btn-outline-white:hover {
    color: #fff !important;
    background-color: #b0b1b2 !important;
    border-color: #b0b1b2 !important;
  }

  .router {
    /*padding-top: 40px;*/
  }

  .inline {

  }

</style>
