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

      <b-navbar-brand href="/" style="font-family: 'Lobster Two'">
        <img class="icon-small" src="./assets/imgs/metacurious.svg"/>
        metaCurious.
      </b-navbar-brand>

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
                <span v-if="savePending"><i class="fa fa-spinner fa-pulse"></i></span>
                <i class="fa fa-exclamation-triangle" v-if="needsSave"></i> Save Changes
              </span>

            </b-button>
          </b-nav-form>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <div class="navbar-collapse justify-content-end">
          <!-- This part only displays if the user is authenticated -->
        <ul class="navbar-nav ml-auto">

          <li class="nav-item" v-if="isAuthenticated && !currentCollection"> <a href="#/createcollection"><i class="fa fa-plus m-2" size="sm"></i>Create Collection</a></li>

          <!-- The login option shows if the user is not authenticated -->
          <li class="nav-item" v-if="!isAuthenticated"><a href="#/login">Login</a></li>
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
        :hostname="hostname"
        :currentCollection="currentCollection" :auth_tokens="auth_tokens"
        :allCollections="allCollections"
        v-on:updateCollection="updateCollections"
        :pendingCollection="pendingCollection"
        v-on:setEdit="setEdit"
        v-on:needsSave="setSave"
        v-on:doLogin="authenticate"
        v-on:savePending="setSavePending"
        ref="routerView"
        />

    </div>
    <div class="footer" style="font-size: small">
        metaCurious is built on Roberto Toro's
        <a href="https://brainspell.herokuapp.com/"> Brainspell., </a>
        <a href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">CC BY-SA 3.0</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import qs from 'simple-query-string';
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
      savePending: false,
      hostname: "https://brainspell.herokuapp.com",
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
    setSavePending(val) {
      this.savePending = val;
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

      axios.get(`${this.hostname}/json/v2/get-user-collections?key=${key}&github_token=${token}&contributors=0&cache=1`)
           .then((resp) => {
             console.log('response on get user collections', resp);
             this.allCollections = resp.data.collections;
             this.allCollections.forEach((coll, idx) => {
               /* eslint-disable */
               coll.name = coll.name.replace('brainspell-neo-collection-', '');
               /* eslint-enable */
               console.log('coll is', coll);
               Vue.set(this.allCollections[idx], 'unmapped_articles', coll.unmapped_articles);
               Vue.set(this.allCollections[idx], 'search_to_articles', coll.search_to_articles);
               const searchStrings = Object.keys(coll.search_to_articles);
               let pmidList = [];
               for (let i = 0; i < searchStrings.length; i += 1) {
                 const skey = searchStrings[i];
                 const pmids = coll.search_to_articles[skey];
                 pmidList = pmidList.concat(pmids);
               }
               Vue.set(this.allCollections[idx], 'mapped_articles', pmidList);
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
    stringifyLocations(loc) {
      const output = [];
      loc.forEach((v) => {
        // Ensure to remove undefined operators to maintain db integrity
        output.push(`${v.x|| ''},${v.y || ''},${v.z || ''}${ v.E ? ',' + v.E : '' }`);
      });
      return output;
    },
    doSave() {
      // console.log('need to save', this.$refs.routerView.info);
      this.savePending = true;
      const data = this.$refs.routerView.info;
      const globalData = {};

      globalData.nsubjects = data.N || -1;
      globalData.experiments = [];
      data.experiments.forEach((v) => {
        const entry = {
          id: v.id,
          caption: v.caption,
          locations: this.stringifyLocations(v.locations),
          descriptors: v.descriptors,
          contrast: v.contrast,
          space: v.space,
          effect: v.effect,
        };
        globalData.experiments.push(entry);
      });
      const contents = JSON.stringify(globalData.experiments);
      axios.post(`${this.hostname}/json/v2/edit-global-article?github_token=${this.auth_tokens.github_access_token}&key=${this.auth_tokens.api_key}&pmid=${data.pmid}&experiments=${contents}&subjects=${globalData.nsubjects}`); /* .then((resp) => {
        //console.log('sent global', resp);
      }); */
      // const data = this.$refs.routerView.info;

      const kvFormat = function kvFormat() {
        const output = {};
        data.experiments.forEach((v) => {
          output[v.id] = v.kvPairs;
        });
        return output;
      };

      const excFormat = function excFormat() {
        const output = {};
        data.experiments.forEach((v) => {
          if (!v.include) {
            output[v.id] = 'excluded';
          }
        });
        return output;
      };

      const localData = {
        collection_name: this.currentCollection.name,
        github_token: this.auth_tokens.github_access_token,
        key: this.auth_tokens.api_key,
        pmid: data.pmid,
        key_value_pairs: JSON.stringify(kvFormat()),
        exclusion_reasons: JSON.stringify(excFormat()),
      };

      const querystring = qs.stringify(localData);
      axios.post(`${this.hostname}/json/v2/edit-local-article?${querystring}`).then((resp) => {
        console.log('local response', resp);
        this.savePending = false;
        this.needsSave = false;
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
  $height-footer: 60px;
  html {
    min-height: 100%;
    position: relative;
    body {
      margin-bottom: $height-footer;
    }
    #footer {
      width: 100%;
      position: relative;
      font-size: small;
      height: $height-footer;
      .footer-block {
        margin: 20px 0;
      }
    }
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height: 100vh;
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
    padding-bottom: 40px;
    min-height: calc(100vh - 100px);
  }

  .inline {

  }

  .icon-small {
    width: 20px;
  }

</style>
