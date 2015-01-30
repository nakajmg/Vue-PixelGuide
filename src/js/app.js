var prefix = 'px-'
Vue.directive(`${prefix}guideline`, {
  bind() {
    this._onMouseEnter = (e)=> {
      this.vm.isEnter = true;
      this.vm[this.vm.direction] = e[this.vm.direction]
    }
    this._onMouseLeave = ()=> {
      this.vm.isEnter = false;
    }
    this._onMouseDown = ()=> {
      this.vm.isDragged = true;
      this.vm.$dispatch('start:drag', this.vm);
    }
    this._onMouseUp = ()=> {
      this.vm.isDragged = false;
      this.vm.$dispatch('end:drag', this.vm);
    }
    this.el.addEventListener('mouseenter', this._onMouseEnter)
    this.el.addEventListener('mouseleave', this._onMouseLeave)
    this.el.addEventListener('mousedown', this._onMouseDown)
    this.el.addEventListener('mouseup', this._onMouseUp)
  }
})

Vue.component('guideline', {
  paramAttributes: ['direction'],
  data() {
    return {direction: null, left: null, top: null, isEnter: false, isDragged: false, x: null, y: null, position: {x: 'top', y: 'left'}, moveTo: {x: 'y', y: 'x'} }
  },
  compiled() {
    this.$watch('$value', ()=> {
      this[this.position[this.direction]] = this.$value;
    }, false, true);
  },
  replace: true,
  partials: {
    line:
      `<${prefix}line v-${prefix}guideline v-style="left: left + 'px', top: top + 'px'" v-partial="info"></${prefix}line>`,
    info:
      `<${prefix}info v-show="isEnter || isDragged" v-style="top: y + 'px', left: x + 'px'">
        <${prefix}position v-if="left">X:{{left}}px</${prefix}position>
        <${prefix}position v-if="top">Y:{{top}}px</${prefix}position>
      </${prefix}info>`
  },
  template: `<${prefix}guideline v-partial="line"></${prefix}guideline>`
})

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
    <${prefix}guide v-on="mousemove: _onMouseMove, mouseup: _onEndDrag">
      <horizon v-repeat="horizon" v-component="guideline" direction="x"></horizon>
      <vertical v-repeat="vertical" v-component="guideline" direction="y"></vertical>
    </${prefix}guide>
  `,
  methods: {
    _onMouseMove(e) {
      if (!this.isDragged) return;
      this.current.$value = e[this.current.moveTo[this.current.direction]];
    },
    _onStartDrag(vm) {
      this.current = vm;
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
