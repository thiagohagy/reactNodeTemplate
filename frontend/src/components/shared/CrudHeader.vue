<template>
  <div class="page-header row">
    <div class="col" v-aclValidator='{level, module}'>
      <router-link :to="{name: addRoute}">
        <button class="btn btn-primary btn-sm">
          Add
        </button>
      </router-link>
      <button class="btn btn-danger btn-sm" @click="onDelete">
        Deletar
      </button>
    </div>
    <div class="col">
      <b-input-group>
        <b-form-input type="text" placeholder="Buscar..." v-model="search"/>
        <b-input-group-append>
          <b-button variant="outline-secondary btn-sm" @click="onSearch()">
            <font-awesome-icon icon="search" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>


<script>
export default {
    props:['addRoute', 'module', 'level'],
    data() {
        return {
            search:'',
        }
    },
    methods: {
        onDelete(){
            this.$emit('onDelete');
            },
        onSearch(){
            this.$emit('onSearch', { search: this.search } );
        }
    },
}
</script>