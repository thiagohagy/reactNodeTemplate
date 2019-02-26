import Vue from 'vue';
import Router from 'vue-router';
import ls from 'local-storage';


// lazy loading
// DEFAULT
/* eslint-disable global-require */
const Home = (resolve) => {
  require.ensure(['./../components/Home.vue'], () => {
    resolve(require('././../components/Home.vue'));
  });
};

const Login = (resolve) => {
  require.ensure(['./../components/auth/Login.vue'], () => {
    resolve(require('././../components/auth/Login.vue'));
  });
};

// USERS
const Users = (resolve) => {
  require.ensure(['./../components/users/Home.vue'], () => {
    resolve(require('././../components/users/Home.vue'));
  });
};

const UsersForm = (resolve) => {
  require.ensure(['./../components/users/Form.vue'], () => {
    resolve(require('././../components/users/Form.vue'));
  });
};

const UsersAcl = (resolve) => {
  require.ensure(['./../components/users/Acl.vue'], () => {
    resolve(require('././../components/users/Acl.vue'));
  });
};

// CLIENTS
const Clients = (resolve) => {
  require.ensure(['./../components/client/Home.vue'], () => {
    resolve(require('././../components/client/Home.vue'));
  });
};

const ClientsForm = (resolve) => {
  require.ensure(['./../components/client/Form.vue'], () => {
    resolve(require('././../components/client/Form.vue'));
  });
};

/* eslint-enable global-require */


Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        humanName: 'Início',
        pathAlias: 'Início',
        showOnNav: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        humanName: 'Login',
        pathAlias: 'Usuários / Login',
      },
    },
    {
      path: '/users',
      component: {
        render(c) { return c('router-view') } /// then I dont need a parent component file
      },
      meta: {
        humanName: 'Usuários',
        showOnNav: true,
      },
      children: [
        {
          path: '',
          name: 'Users',
          component: Users,
          meta: {
            humanName: 'Lista',
            pathAlias: 'Usuários / Lista',
            showOnNav: true,
          },
        },
        {
          path: 'form/:id?',
          props: true, // pass paramas as props, then you dont need to use $watch
          name: 'UsersForm',
          component: UsersForm,
          meta: {
            humanName: 'Formulário',
            pathAlias: 'Usuários / Formulário',
            showOnNav: true,
          },
        },
        {
          path: 'acl/:id?',
          props: true, // pass paramas as props, then you dont need to use $watch
          name: 'UsersAcl',
          component: UsersAcl,
          meta: {
            humanName: 'Lista de acessso',
            pathAlias: 'Usuários / Lista de acessso',
            showOnNav: false,
          },
        },
      ],
    },
    {
      path: '/clients',
      component: {
        render(c) { return c('router-view') } /// then I dont need a parent component file
      },
      meta: {
        humanName: 'Clientes',
        showOnNav: true,
      },
      children: [
        {
          path: '',
          name: 'Clients',
          component: Clients,
          meta: {
            humanName: 'Lista',
            pathAlias: 'Clientes / Lista',
            showOnNav: true,
          },
        },
        {
          path: 'form/:id?',
          props: true, // pass paramas as props, then you dont need to use $watch
          name: 'ClientsForm',
          component: ClientsForm,
          meta: {
            humanName: 'Formulário',
            pathAlias: 'Clientes / Form',
            showOnNav: true,
          },
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = ls('token');
  if (!token && (to.name !== 'Login')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
