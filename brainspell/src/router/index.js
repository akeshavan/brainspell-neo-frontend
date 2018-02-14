import Vue from 'vue';
import Router from 'vue-router';
import About from '@/components/About';
import Home from '@/components/Home';
import Profile from '@/components/Profile';
import Search from '@/components/Search';
import ViewArticle from '@/components/ViewArticle';

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
  ],
});


export default router;
