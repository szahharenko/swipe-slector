<template>
  <div>
    <label
      class="touch-swipe"
      @click="onFocus"
      :class="{ focused: focused, dragging: dragging }"
      ref="container"
    >
      <select :name="settings.name" ref="select">
        <option :selected="item === value" v-for="(item, index) in list" :key="index">{{item}}</option>
      </select>
      <strong>{{value}}</strong>
      <small>{{settings.unit}}</small>
      <span class="trigger"></span>
      <span class="selection" ref="selection">
        <span class="selection-wrapper" ref="scroller" :style="{ 'left': this.drag + 'px' }">
          <span
            class="select-item"
            @click.stop.prevent="setValue(item)"
            :class="{ active: item === value }"
            v-for="(item, index) in list"
            :key="index"
          >{{item}}</span>
        </span>
        <small>{{settings.unit}}</small>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import PointerEventDispatcher from './swiper'

interface Settings {
    name: string;
    unit?: string;
    value?: number;
}

interface EventData {
    stop? : boolean;
    x: number;
}

@Component
export default class SelectBox extends Vue {

    @Prop() private msg!: string;
    @Prop() private list!: Array< any >;
    @Prop() private settings!: Settings;


    @Ref('select') readonly select!: HTMLSelectElement
    @Ref('selection') readonly selection!: HTMLElement
    @Ref('scroller') readonly scroller!: HTMLElement    

    private name = 'SelectBox';
    private value = 0;  
    private focused = false;
    private dragging = false;
    private left = 0;  
    private drag = 0;    

    mounted () {
        const defaultValue =  this.settings.value
        this.value = defaultValue ? defaultValue : this.list[0] // setting default value or first from list
        const parent = this.selection.clientWidth // measure element size
        const scroller = this.scroller.clientWidth // measure inner element size
        const diff = scroller - parent // define dragging limits

        const doc = new PointerEventDispatcher(document.body) // bind element for pointer events handling        

        doc.on('DRAG', (e: EventData) => {
            if(e.stop) {
                this.dragging = false
                this.left = this.drag
            } else {
                this.dragging = true
                const newX = this.left - e.x
                const end = diff + newX
                if(end > 0 && newX < 0) {
                    this.drag = newX
                }
            }
        })
    }
  
    public setValue(item: any): void {
        this.select.value = item
        this.value = item
        this.onBlur()
    }
    public onBlur () {
        this.focused = false
        this.dragging = false
    }
    public onFocus () {
        this.focused = true
    }
}
</script>
<style scoped lang="scss">
  .touch-swipe {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: flex-start;
    min-width: 200px;
    position: relative;
    box-shadow: 0 0 3px 0 #bbb, 0 2px 0 #ccc;
    border-radius: 6px;
    border-left: 6px solid #00817a;
    padding: 6px 0 6px 12px;
    margin: 5px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-align: left;
    padding: 15px;
    font-size: 110%;
    &.focused {
      transform: translateY(-3px);
      box-shadow: 0 0 3px 0 #bbb, 0 7px 0 -3px #aaa;
    }
    &.dragging {
      opacity: 1;

      .trigger {
        z-index: 2;
      }
    }
    select {
      position: absolute;
      bottom: 100%;
      right: 100%;
      opacity: 0;
      width: 0px;
      height: 0px;
    }
    strong {
      flex: 1;
      min-width: 100%;
      display: block;
      font-size: 150%;
    }
    small {
      flex: 1;
    }
    .trigger {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .selection {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s;

      &::after,
      &::before {
        content: '';
        position: absolute;
        top:0;
        width: 20%;
        height: 100%;
        pointer-events: none;
      } 
      &::before {
        left: 0;        
        background: linear-gradient(to right,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
      }      
      &::after {
        right: 0;        
        background: linear-gradient(to right,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      }

      > small {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 75%;
        opacity: 0.7;
        padding: 5px 0;
      }

      > span {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .select-item {
        padding: 15px;
        display: block;
        user-select: none;

        &.active {
          color: #00817a;
          font-weight: bold;
        }
      }
    }
    &.focused .selection {
      opacity: 1;
      pointer-events: all;
      background: rgba(255, 255, 255, 1);
    }
  }
</style>