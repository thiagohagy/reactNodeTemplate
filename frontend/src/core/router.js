import Vue from 'vue';
import Router from 'vue-router';
import ls from 'local-storage';


// lazy loading
// DEFAULT
const Home = () => import('././../components/Home.vue');
const Login = () => import('././../components/auth/Login.vue');
// USERS
const Users = () => import('././../components/users/Home.vue');
const UsersForm = () => import('././../components/users/Form.vue');
const UsersAcl = () => import('././../components/users/Acl.vue');
// CLIENTS
const Clients = () => import('././../components/client/Home.vue');
const ClientsForm = () => import('././../components/client/Form.vue');


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
        showOnNav: true, // deve aparecer na nav?
        module: 'dashboard', // qual modulo pertence?
        aclLevel: 3, // qual nivel de acesso necessario pra ver
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
        render(c) { return c('router-view'); }, // then I dont need a parent component file
      },
      meta: {
        humanName: 'Usuários',
        showOnNav: true,
        module: 'users',
        aclLevel: 3,
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
            module: 'users',
            aclLevel: 3,
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
            module: 'users',
            aclLevel: 2,
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
            module: 'users',
            aclLevel: 2,
          },
        },
      ],
    },
    {
      path: '/clients',
      component: {
        render(c) { return c('router-view'); }, // then I dont need a parent component file
      },
      meta: {
        humanName: 'Clientes',
        showOnNav: true,
        module: 'users',
        aclLevel: 2,
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
            module: 'users',
            aclLevel: 2,
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
            module: 'users',
            aclLevel: 1,
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
