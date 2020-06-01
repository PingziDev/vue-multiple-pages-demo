<template>
  <div class="home">
    <component-sfc></component-sfc>
    <component-jsx></component-jsx>
  </div>
</template>

<script>
  import Vue from 'vue'
  // dev
  import { ComponentJsx, ComponentSfc } from '@/components'
  // use from local lib
  // import { ComponentJsx, ComponentSfc } from './../../lib/index.umd'
  // use from node_modules
  // import { ComponentJsx, ComponentSfc } from 'component-single'

  Vue.use(ComponentSfc)
  Vue.use(ComponentJsx)

  export default {
    name: 'home',
    components: {},
  }
</script>
