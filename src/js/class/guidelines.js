var Guidelines = Vue.extend({

  data() {
    return {
      isDragged: null,
      current: null,
      horizon: null,
      vertical: null
    }
  },
  replace: true,
  template: `
    <${prefix}guide v-on="mousemove: _onMouseMove, mouseup: _onEndDrag">
      <${prefix}rulers></${prefix}rulers>
      <horizon v-repeat="horizon" v-component="guideline" direction="x" v-ref="horizon"></horizon>
      <vertical v-repeat="vertical" v-component="guideline" direction="y" v-ref="vertical"></vertical>
    </${prefix}guide>
  `,
  events: {
    'start:drag': '_onStartDrag',
    'end:drag': '_onEndDrag',
    'add:guide': '_onAddGuide'
  },
  methods: {
    _onMouseMove(e) {
      if (!this.isDragged || !this.current) return;
      this.current.$emit('move', e);
    },
    _onStartDrag(vm) {
      this.current = vm;
      this.isDragged = true;
    },
    _onEndDrag() {
      this.current = null;
      this.isDragged = false;
    },
    _onAddGuide(opt) {
      var e = opt.e;
      var direction = opt.direction;
      var position = opt.position[direction]
      this[direction].push(e[position]);
      setTimeout(()=>{
        this.current = this.$[direction][this[direction].length-1];
        this.current.$emit('init', e)
        this.isDragged = true;
      }, 0);
    }
  }
});
