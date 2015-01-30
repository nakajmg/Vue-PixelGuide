Vue.component('l-horizon', {
  data() {
    return {direction: 'horizon', isEnter: false, isDragged: false, y: null}
  },
  template: `
    <horizon 
      v-on="mousedown: _onMouseDown, mouseup: _onMouseUp, mouseenter: _onMouseEnter, mouseleave: _onMouseLeave"
      v-style="left: $value + 'px'"
    >
      <info v-show="isEnter || isDragged" v-style="top: y + 'px'">X:{{$value}}px</info>
    </horizon>
  `,
  methods: {
    _onMouseDown() {
      this.isDragged = true;
      this.$dispatch('start:drag', this);
    },
    _onMouseUp() {
      this.isDragged = false;
      this.$dispatch('end:drag', this);
    },
    _onMouseEnter(e) {
      this.isEnter = true;
      this.y = e.y;
    },
    _onMouseLeave() {
      this.isEnter = false;
    }
  },
});

Vue.component('l-vertical', {
  data(){
    return {direction: 'vertical', isEnter: false, isDragged: false, x: null}
  },
  template: `
    <vertical v-on="mousedown: _onMouseDown, mouseup: _onMouseUp, mouseenter: _onMouseEnter, mouseleave: _onMouseLeave"
      v-style="top: $value + 'px'"
    >
      <info v-show="isEnter || isDragged" v-style="left: x + 'px'">Y:{{$value}}px</info>
    </vertical>
  `,
  methods: {
    _onMouseDown() {    
      this.isDragged = true;  
      this.$dispatch('start:drag', this);
    },
    _onMouseUp() {
      this.isDragged = false;
      this.$dispatch('end:drag', this);
    },
    _onMouseEnter(e) {
      this.isEnter = true;
      this.x = e.x;
    },
    _onMouseLeave() {
      this.isEnter = false;
    }
  }
});

var vm = new Vue({
  events: {
    'start:drag': '_onStartDrag',
    'end:drag': '_onEndDrag'
  },
  data: {
    isDragged: false,
    current: null,
    horizon: [
      10, 15, 20, 30
    ],
    vertical: [
      4, 8, 20, 30
    ]
  },
  replace: true,
  template: `
    <px-guide v-on="mousemove: _onMouseMove, mouseup: _onEndDrag">
      <template v-repeat="horizon" v-component="l-horizon"></template>
      <template v-repeat="vertical" v-component="l-vertical"></template>
    </px-guide>
  `,
  methods: {
    _onMouseMove(e) {
      if (!this.isDragged) return;
      if (this.current.direction === 'horizon') {
        this.current.$value = e.x;
      }
      else {
        this.current.$value = e.y;
      }
    },
    _onStartDrag(target) {
      this.current = target;
      this.isDragged = true;
    },
    _onEndDrag() {
      this.isDragged = false;
      this.current = null;
    }
  }
});

vm.$mount();
vm.$appendTo('body');
