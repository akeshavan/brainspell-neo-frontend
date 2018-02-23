<template>
  <div id="app">
    <!-- The Navbar below stays constant throughout the app.
         We've set up links on the navbar to different "routes",
         like the "Home" page and "About" page.

         There is also a right-aligned link to Login with GitHub.
         When logged in, this shows the username with a dropdown menu
         to see the profile or logout.
    -->
    <b-navbar toggleable="md" type="dark" variant="dark">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">Brainspell</b-navbar-brand>

      <!-- If the viewport is small, the navbar collapses.
          Everything in b-collapse is what gets collapsed.
      -->
      <b-collapse is-nav id="nav_collapse">

        <!--  Here are links to different routes  -->
        <b-navbar-nav>
          <b-nav-item to="/" exact>Home</b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- This part only displays if the user is authenticated -->

          <b-nav-item-dropdown right v-if="isAuthenticated && currentCollection">
            <template slot="button-content" v-if="currentCollection">
              <em>{{currentCollection}}</em>
            </template>
            <b-dropdown-item to="/createcollection" v-if="currentCollection"> <i class="fa fa-plus"></i> Create Collection </b-dropdown-item>

          </b-nav-item-dropdown>

          <b-nav-item to="/createcollection" v-if="isAuthenticated && !currentCollection"><i class="fa fa-plus"></i> Create Collection</b-nav-item>

          <b-nav-item-dropdown right v-if="isAuthenticated">
            <template slot="button-content">
              <em>{{userInfo.login}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- The login option shows if the user is not authenticated -->

          <b-nav-item v-else @click="authenticate">Login</b-nav-item>



        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <!-- The content is in the router view -->


    <div class="router">
      <router-view :userInfo="userInfo" :isAuthenticated="isAuthenticated"/>
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
      userInfo: {
        username: null,
      },
      currentCollection: null,
      allCollections: [],
    };
  },

  computed: {

  },
  methods: {
    authenticate() {
      const self = this;
      auth.login(() => {
        self.getUserInfo();
      });
    },
    getUserInfo() {
      const token = auth.getToken();
      const key = auth.getKey();
      const self = this;
      // TODO: CHANGE THIS TO YOUR SERVER
      // In this example, we are getting user info from github
      // If this fails, then our token is bad; we are NOT authenticated and
      // should be logged out
      axios.get(pathJoin('https://api.github.com', 'user'), {
        headers: {
          Authorization: `token ${token}`,
        },
      }).then((resp) => {
        self.isAuthenticated = true;
        // TODO: do stuff here, like setting user info variables
        self.userInfo = resp.data;
      }).then(() => {
        // Get the user's collections
        axios.get(`https://brainspell.herokuapp.com/json/collections?key=${key}&github_access_token=${token}&pmid=1`)
             .then((resp) => {
               console.log(resp);
             });
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
