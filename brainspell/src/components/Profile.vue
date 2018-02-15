<template>
  <div id="profile">
    <!-- Only show stuff is the user is authenticated -->

      <!-- userInfo is a prop that was passed in from App -->
      <div v-if="isAuthenticated">
        <h1>
          <img :src="userInfo.avatar_url" class="img img-thumbnail avatar rounded-circle"> {{userInfo.login}} </img>
        </h1>
        <p>
          You are logged in. Try logging out to see what happens to this page.
        </p>
      </div>

      <div v-else>
        Log in to see your profile!
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

    };
  },
  // the parent component feeds these vars to this component
  props: ['userInfo', 'isAuthenticated'],
};
</script>
