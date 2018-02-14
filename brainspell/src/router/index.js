import Vue from 'vue';
import Router from 'vue-router';
import About from '@/components/About';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
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
      path: '/search/:query',
      name: 'Search',
      component: Search,
    },
    {
      path: '/createcollection',
      name: 'CreateCollection',
      component: CreateCollection,
    },
  ],
});


export default router;
