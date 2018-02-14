import Vue from 'vue';
import Router from 'vue-router';
import About from '@/components/About';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import ViewArticle from '@/components/ViewArticle';
import Play from '@/components/Play';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import Terms from '@/components/Terms';
import Upload from '@/components/Upload';
import Unauthorized from '@/components/Unauthorized';
import Leaderboard from '@/components/Leaderboard';
import CreateCollection from '@/components/CreateCollection';
import firebase from 'firebase';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*', // redirect to login view
      redirect: '/login',
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/view-article/:id',
      name: 'ViewArticle',
      component: ViewArticle,
    },
    {
      path: '/play',
      name: 'Play',
      component: Play,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms,
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: Unauthorized,
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard,
    },
    {
      path: '/createcollection',
      name: 'CreateCollection',
      component: CreateCollection,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  if (requiresAuth && !currentUser) next('login');
  if (requiresAdmin) {
    console.log('requires admin');
    firebase.database().ref(`/users/${currentUser.displayName}`).once('value')
    .then((snap) => {
      console.log('snap is', snap.val());
      if (requiresAdmin && !snap.val().admin) next('unauthorized');
      else next();
    });
  } else {
    next();
  }
});

export default router;
