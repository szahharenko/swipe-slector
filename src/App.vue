<template>
  <div id="app">

    <form action="https://httpbin.org/post" method="post">
      <SelectBox
        :list="[0,80,320,280,98]"
        :settings="{
          name: 'income',
          unit: 'EUR/Month',
          value: 80
        }">
      </SelectBox>

      <SelectBox
        :list="['liters','kilometers','miles','inches','parrots']"
        :settings="{
          name: 'units',
          unit: 'units'
        }">
      </SelectBox>

      <SelectBox
        :list="['here','is','my','test','assigment']"
        :settings="{
          name: 'words'
        }">
      </SelectBox>

      <button type="submit">Submit example form</button>

    </form>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SelectBox from './components/swipe-slect/SelectBox.vue';

@Component({
  components: {
    SelectBox,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
