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
          <b-nav-item-dropdown right v-if="userInfo">
            <template slot="button-content">
              <em>{{userInfo.displayName}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item @click="logout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- The login option shows if the user is not authenticated -->

          <b-nav-item v-else to="login">Login</b-nav-item>



        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <!-- The content is in the router view -->


    <div class="router">
      <router-view :userInfo="userInfo" :userData="userData"/>
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueFire from 'vuefire';
import firebase from 'firebase';
import '../node_modules/font-awesome/css/font-awesome.min.css';
// import db from './main';

// explicit installation required in module environments
Vue.use(VueFire);
Vue.use(BootstrapVue);


export default {
  name: 'app',
  data() {
    return {
      userInfo: {},
      allUsers: [],
    };
  },

  /* firebase: {
    allUsers: db.ref('/users/'),
  },*/

  computed: {
    userData() {
      let data = {};
      if (!this.userInfo) {
        return data;
      }
      this.allUsers.forEach((val) => {
        if (val['.key'] === this.userInfo.displayName) {
          data = val;
        }
      });
      return data;
    },
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.userInfo = null;
        this.$router.replace('login');
      });
    },
    setUser(user) {
      console.log('setting user', this.userInfo);
      this.userInfo = user;
    },
  },

  created() {
    this.userInfo = firebase.auth().currentUser;
    const self = this;
    firebase.auth().onAuthStateChanged((user) => {
      console.log('hi');
      self.userInfo = user;
    });
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

  #signupForm {
    max-width: 400px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0px 0 7px 0px #80808036;
  }

  .inline {

  }

</style>
