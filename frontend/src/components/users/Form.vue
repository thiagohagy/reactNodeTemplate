<template>
  <div class="container text-left" >
    <div class="text-center">
      <h3>{{ pageTitle }}</h3>
    </div>

    <form>
      <div class="row">
        <div class="col-9">

          <b-form-group id="clientLabel" label="Client:" label-for="client" >
            <vue-bootstrap-typeahead
              placeholder="Start typing to show a list..."
              v-model="form.clientQuery"
              @hit="form.client = $event._id"
              :serializer="c => c.name"
              :data="clients"
            />
          </b-form-group>

          <b-form-group id="emailLabel" label="Email address:" label-for="email" description="We'll never share your email with anyone else.">
            <b-form-input  id="email" type="email" v-model="form.email"  placeholder="Enter email"></b-form-input>
          </b-form-group>

          <b-form-group id="loginLabel" label="Login:" label-for="login" >
            <b-form-input id="login" type="text" v-model="form.login"  placeholder="An diferent and creative login"></b-form-input>
          </b-form-group>
        </div>

        <div class="col ">
          <b-form-group id="avatarLabel" label="Avatar:" label-for="role" class="" >
            <vue-dropzone
              ref="myVueDropzone"
              id="dropzone"
              :destroyDropzone="false"
              :options="dropzoneOptions"
              :useCustomSlot=true
              v-on:vdropzone-sending="getExtraUploadData"
              v-on:vdropzone-success="setAvatarData"
             >
              <div class="dropzone-custom-content">
                <h3 class="dropzone-custom-title">Arraste uma foto aqui!</h3>
                <div class="subtitle">...ou clique para selecionar</div>
              </div>
            </vue-dropzone>
          </b-form-group>
          <b-alert show variant="info" v-if="form._id">Deixe em branco para manter a mesma</b-alert>
        </div>
      </div>

      <div class="row">
        <b-form-group class="col" id="nameLabel" label="Your name:" label-for="name" >
          <b-form-input id="name" type="text" v-model="form.name"  placeholder="Name please"></b-form-input>
        </b-form-group>

        <b-form-group class="col" id="roleLabel" label="User role:" label-for="role" >
          <b-form-select v-model="form.role" :options="roles"  class="mb-3" id="role"/>
        </b-form-group>
      </div>

      <div class="row">
        <b-form-group class="col" id="passwordLabel" label="Password:" label-for="password" >
          <b-form-input id="password" type="password" v-model="form.password"  placeholder="A complex password"></b-form-input>
        </b-form-group>

        <b-form-group class="col" id="passwordCLabel" label="Password confirm:" label-for="passwordC" >
          <b-form-input id="passwordC" type="password" v-model="form.passwordC" placeholder="An equally complex password"
          :state="(form.password == form.passwordC) && form.password != ''"  class="error"></b-form-input>
        </b-form-group>

      </div>

      <b-alert show variant="info" v-if="form._id">Deixe em branco para manter a mesma senha</b-alert>

      <div class="text-center" v-aclValidator='{level: 2, module}'>
        <b-button type="button" variant="primary" @click="onSubmit" >Enviar</b-button>
        <router-link to="/users">
          <b-button type="reset" variant="danger"  >
            Cancelar
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
        email: '',
        login: '',
        name: '',
        password: '',
        role: '',
        clientQuery: '',
        client: '',
        avatar: {
          filename: '',
          mimetype: '',
          folder: '',
        },
      },
      pageTitle: 'Cadastro de usuário',
      roles: [
        { value: '', text: '--selecione--' },
        { value: 'admin', text: 'Admin' },
        { value: 'basic', text: 'Basico' },
      ],
      dropzoneOptions: this.$http.getDropzoneConfig(
        {
          addRemoveLinks: true,
          capture: true,
          parallelUploads: 1,
          uploadMultiple: false,
          thumbnailWidth: 150,
          acceptedFiles: 'image/*',
          maxFilesize: 2,
          autoProcessQueue: true,
          maxFiles: 1,
          dictDefaultMessage: 'Enviar',
        },
      ),
    };
  },
  methods: {
    setAvatarData(file, response) {
      this.form.avatar = {};
      this.form.avatar.filename = response.file.filename;
      this.form.avatar.mimetype = response.file.mimetype;
      this.form.avatar.folder = response.file.destinationFolder;
    },
    getExtraUploadData(file, xhr, formData) {
      formData.append('folder', 'avatar'); // add field to upload form
    },
    async onSubmit() {
      if (this.form._id) {
        if (this.form.email && this.form.login && this.form.role) {
          const response = await this.$http.put('v1/users', this.form); // request with async await

          if (response.success) {
            this.$toasted.show('Usuario editado com sucesso', { icon: 'check', type: 'success' });
            this.$router.push({ name: 'Users' });
          } else {
            this.$toasted.show(response.err, { icon: 'times', type: 'error' });
          }
        } else {
          this.$toasted.show('Informe o email, tipo, cliente, login e senha. A senha e a confirmação tem que ser iguais', { icon: 'times', type: 'error' });
        }
      } else if (
        this.form.client &&
        this.form.email &&
        this.form.login &&
        (this.form.password && this.form.password === this.form.passwordC) &&
        this.form.role
      ) {
        const response = await this.$http.post('v1/users', this.form); // request with async await

        if (response.success) {
          this.$toasted.show('Cadastro concluido com sucesso', { icon: 'check', type: 'success' });
          this.$router.push({ name: 'Users' });
        } else {
          this.$toasted.show(response.err, { icon: 'times', type: 'error' });
        }
      } else {
        this.$toasted.show('Informe o email, tipo, cliente, login e senha. A senha e a confirmação tem que ser iguais', { icon: 'times', type: 'error' });
      }
    },
    async getClients(search) {
      const resposta = await this.$http.post('/v1/clients/list', { all: true, busca: search });
      this.clients = resposta.data;
    },
  },
  async mounted() {
    if (this.id) {
      this.pageTitle = 'User edit';
      const response = await this.$http.get(`/v1/users/${this.id}`);
      if (response._id) {
        delete response.password;
        this.form = response;
      } else {
        this.$toasted.show('OPS!!! Ocorreu um erro', { icon: 'times', type: 'error' });
      }
    }

    let decoded = this.$store.getters.decoded;
    if(decoded.role == 'root') {
      this.roles.push({ value: 'root', text: 'Root' });
    }

    this.getClients();
  },
  components: {
    vueDropzone: vue2Dropzone,
  },
};
</script>

<style>
.dropzone-custom-content {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  background-color: #314b5f;
  text-align: center;
}

.vue-dropzone{
  border-radius: 50%;
  width: 200px;
  height: 200px;
  margin: 0px auto;
  padding: 0px;
}

.dropzone img{
  border-radius: 50%;
  width: 200px;
  max-height: 200px;
}

.dropzone .dz-message, .dropzone .dz-preview{
  width: 200px;
  margin: 0px;
  padding: 0px;
}


.dropzone-custom-title {
  padding-top: 30%;
  color: #00b782;
  font-size: 18px;
}

.subtitle {
  color: #fff;
}
</style>
