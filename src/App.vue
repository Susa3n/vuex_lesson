<template>
  <div id="app">
    susa3n的年龄为：{{ $store.state.age }}
    <hr />
    我的年龄为: {{ $store.getters.myAge }}
    <hr />
    <button @click="syncAdd">增加</button>
    <button @click="asyncMinus">异步减少</button>
    <hr />
    d的年龄：{{ $store.state.d && $store.state.age }} d的名称:{{
      $store.state.d && $store.state.d.name
    }}
    <h2>{{$store.state.a.aAge}}</h2>
    <!-- <button @click="registModule">registModule</button> -->
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    syncAdd(){
      this.$store.commit('syncAdd',10)
    },
    asyncMinus(){
      this.$store.dispatch('asyncMinus',10)
    },
    registModule() {
      this.$store.registerModule(["d"], {
        state: {
          name: "ddddd",
          age: 20,
        },
      });
    },
  },
};
</script>

<style></style>
