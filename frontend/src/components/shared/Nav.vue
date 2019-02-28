<template>

  <b-navbar toggleable="md" type="dark" variant="info"  class="navbar navbar-expand-lg navbar-dark bg-dark" v-if="isLogged">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">
      <router-link to="/" class="navbar-brand">Vue Show</router-link>
    </b-navbar-brand>

    <b-navbar-nav id="myBredcrumb">
      <b-nav-text >
        {{breadcrumb}}
      </b-nav-text>
    </b-navbar-nav>

    <b-collapse is-nav id="nav_collapse">

      <!-- simples routes -->
      <b-navbar-nav>
        <b-nav-item
        href="#"
        class="nav-item"
        :key='link.name'
        v-aclValidator='{ level: link.meta.aclLevel, module: link.meta.module }'
        v-for="link in filterLinks(links, 'simple')">
          <router-link :to="{ name: link.name }" class="nav-link">{{link.meta.humanName}}</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <!-- nested routes -->
      <b-navbar-nav>
        <b-nav-item-dropdown
          class="nav-item"
          :text="link.meta.humanName"
          :key='link.name'
          v-aclValidator='{ level: link.meta.aclLevel, module: link.meta.module }'
          v-for="link in filterLinks(links, 'nested')"
        >
          <b-dropdown-item
            href="#"
            :key='sublink.name'
            v-aclValidator='{ level: sublink.meta.aclLevel, module: sublink.meta.module }'
            v-for="sublink in filterLinks(link.children, 'sublink')"
          >
            <router-link :to="{ name: sublink.name }" class="nav-link dropdown-nav-link">{{sublink.meta.humanName}}</router-link>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!--
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
      -->

      <b-navbar-nav class="ml-auto ">
        <b-nav-item id="profileDropdown">
          <b-nav-item-dropdown class="nav-item" :text="decoded.name || decoded.login" right>
            <b-dropdown-item href="#">
              <router-link :to="{ name: 'UsersForm', params:{ id: decoded._id } }" class="nav-link dropdown-nav-link">Meu perfil</router-link>
            </b-dropdown-item>

            <b-dropdown-item href="#" @click="logout()">
              <div class="nav-link dropdown-nav-link">
                Sair
                <font-awesome-icon icon="sign-out-alt" />
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav-item class="nomargin">
          <router-link :to="{ name: 'UsersForm', params:{ id: decoded._id } }" class="navbar-brand nomargin">
            <img
              rounded="circle"
              blank
              width="55"
              style=""
              height="55"
              blank-color="#777"
              alt="My profile"
              title="My profile"
              class="m-1 nomargin rounded-circle img"
              :src="getFile()"
            >
          </router-link>
        </b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
import store from '@/store';
import jwtDecode from 'jwt-decode';

export default {
  name: 'app-nav',
  data() {
    return {
      links: [],
      breadcrumb: '',
      token: {},
      api: '',
      decoded: '',
    };
  },
  methods: {
    logout() {
      this.$store.commit('user_logout');
    },
    getFile() {
      if (this.decoded) {
        let file = `${this.api}/api/v1/upload?`;
        file += `token=${this.token}`;
        file += `&mimetype=${this.decoded.avatar.mimetype}`;
        file += `&filename=${this.decoded.avatar.filename}`;
        file += `&folder=${this.decoded.avatar.folder}`;
        return file;
      } else {
        return '';
      }
    },
    filterLinks(links, tipo) {
      let newLinks = [];

      for (let i = 0; i < links.length; i++) {
        const link = links[i];

        if ( tipo == 'sublink' && link.meta.showOnNav) {
          newLinks.push(link);
        } else if ( tipo == 'simple' && (!link.children && link.meta.showOnNav)) {
          newLinks.push(link);
        } else if ( tipo == 'nested' && (link.children && link.meta.showOnNav)) {
          newLinks.push(link);
        }

      }

      return newLinks;
    },
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  mounted() {
    this.api = process.env.VUE_APP_API;
    this.links = this.$router.options.routes;
    this.decoded = jwtDecode(this.$store.getters.authToken);
    this.token = this.$store.getters.authToken;
  },
  watch: {
    '$route' (to, from) {
      this.breadcrumb = this.$route.meta.pathAlias;
    }
  }
};
</script>

<style scoped>
#myBredcrumb{
  position: absolute;
  top: 50px;
  left: 170px;
}
#myBredcrumb span {
  font-weight: 100;
  font-size: 11px;
  color: #777
}
.collapse{
  width: 100%
}

.nomargin {
  margin:0px;
  padding:0px;
}

#nav_collapse{
  margin-right:0px;
  padding-right:0px;
}

#profileDropdown{
  margin-right: 0px;
  padding-right: 0px;
}

#profileDropdown .nav-item {
  margin: 0px;
}

</style>
