<template>
  <div class="container text-left" >

    <div class="text-center">
      <h3>ACL do usuário - {{form.user.login}} </h3>
    </div>

    <form>

      <div class="row">
        <div class="col">
          <b-form-group  id="defaultModuleLabel" label="Modulos disponíveis:" label-for="modules" >
          <div class="input-group no-padding">
            <b-form-select id="selectedModule" :options="systemModules" v-model="form.selectedModule" />
            <div class="input-group-append">
              <button class="btn btn-sm btn-outline-primary" type="button" id="button-addon2" @click="addUserModule()" :disabled='!form.selectedModule' >Adicionar modulo</button>
            </div>
            </div>
          </b-form-group>
        </div>
      </div>


      <div class="page-data row">
        <div class="col-sm-3" v-for="(module, index) in form.modules" :key="module.module">
          <div class="moduleCard">
            <div class="row">

              <div class="col-sm-12">
                <p class="text-center title">{{module.name}}</p>
              </div>

              <div class="col">
                <b-form-select id="selectedModule" :options="permissionLevels" v-model="module.level" />
              </div>

              <div class="col">
                <b-button type="button" variant=" btn-outline-primary btn-sm" @click="form.modules.splice(index,1)" >Remover</b-button>
              </div>
            </div>
        </div>

        </div>
      </div>

      <div class="text-center" v-aclValidator='{level: 2, module}'>
        <b-button type="button" variant="primary" @click="onSubmit" >Salvar</b-button>
        <router-link to="/users">
          <b-button type="reset" variant="danger"  >
            Cancel
          </b-button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>

import vue2Dropzone from 'vue2-dropzone';

export default {
  props:['id'],
  data() {
    return {
      module:'users',
      clients: [],
      form:{
        _id: '',
        user: '',
        modules: [],
        defaultModule: '',
        selectedModule: '',
      },
      permissionLevels: [
        { value: 1, text: 'Root' },
        { value: 2, text: 'Admin' },
        { value: 3, text: 'Basic' },
      ],
      systemModules: [],
    };
  },
  methods: {
    async onSubmit() {
      if (this.form._id) {
          const response = await this.$http.put('v1/users/updateAcl', this.form); // request with async await

          if (response.success) {
            this.$toasted.show('Acl atualizada', { icon: 'check', type: 'success' });
            this.$router.push({ name: 'Users' });
          } else {
            this.$toasted.show(response.err, { icon: 'times', type: 'error' });
          }
      } else {
        this.$toasted.show('Não foi possivel atualizar a ACL do usuário', { icon: 'times', type: 'error' });
      }
    },
    addUserModule() {

      if (this.form.selectedModule) {
        let jaTem = false;

        for (let i = 0; i < this.form.modules.length; i++) {
          const mod = this.form.modules[i];
          if(mod.module === this.form.selectedModule.module) {
            jaTem = true;
          }
        }

        if(!jaTem) {
          this.form.modules.push({
            name: this.form.selectedModule.name,
            module: this.form.selectedModule.module,
            level: 2,
          });

        } else {
          this.$toasted.show('Esse modulo ja esta liberado para este usuário', { icon: 'times', type: 'error' });
        }
      }
    },
  },
  async mounted() {
    if (this.id) {
      this.pageTitle = 'User edit';
      const response = await this.$http.get(`/v1/users/acl/${this.id}`);

      for (let i = 0; i < response.systemModules.length; i++) {
        const sm = response.systemModules[i];
        this.systemModules.push({ text: sm.name, value: sm });
      }
      this.form = response.acl
    }
  },
};
</script>

<style scoped>
  .page-data{
    margin-bottom: 20px;
  }
  .moduleCard .row {
    background-color: azure;
    border: 1px solid lightblue;
    padding: 25px
  }

  .moduleCard .title {
    font-weight: bold
  }

</style>
