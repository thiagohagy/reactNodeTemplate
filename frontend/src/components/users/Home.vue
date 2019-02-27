<template>
  <div class="container text-left" >

    <my-crud-header
      v-aclValidator='{level: 2, module}'
      addRoute='UsersForm'
      @onDelete='deleteSelected'
      @onSearch='search = $event.search; listAll()'
    >
    </my-crud-header>

    <div class="page-data">
      <div class="row">
        <div class="col">

          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th
                    v-aclValidator='{level: 2, module}'
                    scope="col"><b-form-checkbox
                    v-model="selectAllStatus"
                    @change='selectAll()'
                  >
                  </b-form-checkbox>
                  </th>
                <th scope="col">Cliente</th>
                <th scope="col">Login</th>
                <th scope="col">Email</th>
                <th scope="col">Tipo</th>
                <th scope="col" v-aclValidator='{level: 2, module}' >Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='item in list' :key="item._id">
                <td v-aclValidator='{level: 2, module}'>
                  <b-form-checkbox
                    v-model="item.selected"
                  >
                  </b-form-checkbox>
                </td>
                <td>
                  <span v-if="item.client">
                    {{item.client.name}}
                  </span>
                </td>
                <td>{{item.login}}</td>
                <td>{{item.email}}</td>
                <td>{{item.role}}</td>
                <td v-aclValidator='{level: 2, module}'>
                  <b-button variant="outline-secondary btn-sm">
                    <router-link :to="{name: 'UsersAcl', params: {id: item._id }}">
                      ACL
                    </router-link>
                  </b-button>
                  <b-button variant="outline-secondary btn-sm">
                    <router-link :to="{name: 'UsersForm', params: {id: item._id }}">
                      Editar
                    </router-link>
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <my-pagination
        :total='totalItens'
        @pageChanged='listAll($event.skip,$event.limit)'
      ></my-pagination>

    </div>

  </div>
</template>


<script>
  import CrudHeader from './../shared/CrudHeader.vue';

  export default {
    data () {
      return {
        module: 'users',
        list: [],
        totalItens: 0,
        selectAllStatus: false,
        search: '',
      }
    },
    methods: {
      async listAll(skip = 0,limit = 5){ // default values
        let resposta = await this.$http.post('/v1/users/list', { skip, limit, busca: this.search});
        this.totalItens = resposta.total;
        this.list = resposta.data;
      },
      selectAll() {
        for (let i = 0; i < this.list.length; i++) {
          const el = this.list[i];
          el.selected = !this.selectAllStatus;
        }
      },
      async deleteSelected(){
        for (let i = 0; i < this.list.length; i++) {
          const el = this.list[i];
          if (el.selected) {
            let response = await this.$http.delete(`/v1/users/${el._id}`);
            console.log(response);
          }
        }
        this.listAll();
      }
    },
    beforeMount() {
      this.listAll();
    },
    components:{
      'my-crud-header': CrudHeader,
    }
  }
</script>