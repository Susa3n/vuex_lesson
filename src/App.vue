<template>
  <div id="app">
    susa3n的年龄为：{{ $store.state.age }} {{age}}
    <hr />
    我的年龄为: {{ $store.getters.myAge }} {{myAge}}
    <hr />
    <button @click="syncAdd(5)">增加</button>
    <button @click="asyncMinus(10)">异步减少</button>
    <hr />
    d的年龄：{{ $store.state.d && $store.state.age }} d的名称:{{
      $store.state.d && $store.state.d.name
    }}
    <h2>{{$store.state.a.aAge}}</h2>
    <button @click="registModule">registModule</button>
    <hr>
    d.age: <h2>{{$store.state.d && $store.state.d.age}}</h2>
    d.dAge: <h2>{{$store.getters && $store.getters.dAge }}</h2>
    <!-- <TestTable></TestTable> -->
  </div>
</template>

<script>
import { mapActions,mapGetters,mapMutations,mapState} from './vuex/index'
export default {
  name: "App",
  computed: {
    ...mapState(['age']),
    ...mapGetters(['myAge'])
  },
  methods: {
    ...mapActions(['asyncMinus']),
    ...mapMutations(['syncAdd']),
    registModule() {
      this.$store.registerModule(["d"], {
        state: {
          name: "ddddd",
          age: 20,
        },
        getters: {
          dAge(state) {
            return state.age + 10
          }
        }
      });
    },
  },
};
</script>

<style></style>
