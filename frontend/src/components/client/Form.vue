<template>
  <div class="container text-left" >

    <div class="text-center">
      <h3>{{ pageTitle }}</h3>
    </div>

    <form>

      <div class="row">
        <div class="col-12">
          <b-form-group id="nameLabel" label="Nome:" label-for="name" >
            <b-form-input id="name" type="text" v-model="form.name"  placeholder="Nome do cliente"></b-form-input>
          </b-form-group>
        </div>
      </div>

      <div class="text-center" v-aclValidator='{level: 2, module}'>
        <b-button type="button" variant="primary" @click="onSubmit" >Enviar</b-button>
        <router-link to="/clients">
          <b-button type="reset" variant="danger"  >
            Cancelar
          </b-button>
        </router-link>
      </div>
    </form>
  </div>

</template>

<script>

  export default {
    props:['id'],
    data() {
      return {
        module:'clients',
        form:{
          name: '',
        },
        pageTitle: 'Cadastro de clientes',
      }
    },
    methods: {
      async onSubmit(){
        if (this.form._id) {
           if ( this.form.name) {
            let response = await this.$http.put('v1/clients', this.form); // request with async await

            if (response.success) {
              this.$toasted.show('Cliente editado com sucesso',{icon:'check', type: 'success'});
              this.$router.push({name: "Clients"});
            } else {
              this.$toasted.show(response.err ,{icon:'times', type: 'error'});
            }
          } else {
            this.$toasted.show('Informe o nome do cliente',{icon:'times', type: 'error'})
          }
        } else {

          if ( this.form.name ) {
            let response = await this.$http.post('v1/clients', this.form); // request with async await

            if (response.success) {
              this.$toasted.show('Cadastro concluido com sucesso',{icon:'check', type: 'success'});
              this.$router.push({name: "Clients"});
            } else {
              this.$toasted.show(response.err ,{icon:'times', type: 'error'});
            }
          } else {
            this.$toasted.show('Informe o nome do cliente', {icon:'times', type: 'error'})
          }
        }
      },
    },
    async mounted() {
      if (this.id) {
        this.pageTitle =  'Edição de cliente';
        let response = await this.$http.get(`/v1/clients/${this.id}`);
        if (response._id) {
          delete response.password;
          this.form = this.form = response;
        } else {
          this.$toasted.show(response.err ,{icon:'times', type: 'error'});
        }
      }
    },
  }
</script>



