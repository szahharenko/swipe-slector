<template>
    <div>
      <label class="touch-swipe" @click="onFocus" :class="{ focused: focused, dragging: dragging }" ref="container">
        <select :name="settings.name"  ref="select">
          <option :selected="item === value" v-for="(item, index) in list" :key="index">
            {{item}}
          </option>
        </select>
        <strong>{{value}}</strong>
        <small>{{settings.unit}}</small>
        <span class="trigger"></span>
        <span class="selection" ref="selection">
            <span class="selection-wrapper" ref="scroller"  :style="{ 'left': this.drag + 'px' }">
                <span class="select-item" @click.stop.prevent="setValue(item)" :class="{ active: item === value }" v-for="(item, index) in list" :key="index">
                    {{item}}
                </span>
            </span>
        </span>
      </label>
  </div>
</template>

<script>
import PointerEventDispatcher from './swiper'

export default {
  name: 'SelectBox',
  data () {
      return {
        value: 0,
        focused: false,
        dragging: false,
        left: 0,
        drag: 0
      }
  },
  mounted () {

    const defaultValue = this.$props.settings.value
    this.value = defaultValue ? defaultValue : this.$props.list[0]

    const doc = new PointerEventDispatcher(document)
    const parent = this.$refs['selection'].clientWidth
    const scroller = this.$refs['scroller'].clientWidth
    const diff = scroller - parent

    doc.on('DRAG', (e) => {
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
  },
  methods: {
      setValue (item) {
          this.$refs['select'].value = item
          this.value = item
          this.onBlur()
      },
      onBlur () {
        this.focused = false
        this.dragging = false
      },
      onFocus () {
          this.focused = true
      }
  },
  props: {
    list: Array,
    settings: Object
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
        background: rgba(255,255,255,1);
    }
}

</style>