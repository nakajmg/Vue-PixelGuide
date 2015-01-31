(() => {

var prefix = "px-";

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
});

Vue.component('guideline', {
  paramAttributes: ['direction'],
  data() {
    return {direction: null, left: null, top: null, isEnter: false, isDragged: false, x: null, y: null, position: {x: 'top', y: 'left'}, moveTo: {x: 'y', y: 'x'} }
  },
  compiled() {
    this.$watch('$value', this._onChange$value, false, true);
  },
  replace: true,
  partials: {
    line:
      `<${prefix}line v-${prefix}guideline v-style="left: left + 'px', top: top + 'px'" v-partial="info"></${prefix}line>`,
    info:
      `<${prefix}info v-show="isEnter || isDragged" v-style="top: y + 'px', left: x + 'px'">
        <${prefix}position>{{left}}{{top}}</${prefix}position>
      </${prefix}info>`
  },
  template: `<${prefix}guideline v-partial="line"></${prefix}guideline>`,
  events: {
    move: '_onMove',
    init: '_onInit'
  },
  methods: {
    _onMove(e) {
      var moveTo = this.moveTo[this.direction];
      this.$value = "" + e[moveTo];
    },
    _onChange$value() {
      this[this.position[this.direction]] = this.$value;  
    },
    _onInit(e) {
      this.isEnter = true;
      this[this.direction] = e[this.direction]
    }
  }
});

Vue.component('ruler-grid', {
  paramAttributes: ['direction'],
  data() {
    return {isPoint: null, isScale: null, top: null, left: null, position: {vertical: 'top', horizon: 'left'} }
  },
  template: `
    <${prefix}ruler-grid v-style="top: top + 'px', left: left + 'px'" v-attr="${prefix}ruler-grid-point: isPoint, ${prefix}ruler-grid-scale: isScale"></${prefix}ruler-grid>
  `,
  compiled() {
    if (!this.$value) return;
    this[this.position[this.direction]] = this.$value;
    this.isPoint = !(this.$value % 50);
    this.isScale = !(this.$value % 10);
  }
});

Vue.component('ruler-point', {
  paramAttributes: ['direction'],
  data() {
    return {top: null, left: null, position: {vertical: 'top', horizon: 'left'} }
  },
  template: `
    <${prefix}ruler-point-value v-style="top: top + 'px', left: left + 'px'">{{$value}}</${prefix}ruler-point-value>
  `,
  compiled() {
    if (!this.$value) return;
    this[this.position[this.direction]] = this.$value
  }
});

var Guidelines = Vue.extend({
  data() {
    return {
      isDragged: null,
      current: null,
      horizon: [],
      vertical: []
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

Vue.component('ruler-controler', {
  replace: true,
  template: `
    <${prefix}ruler-controler v-on="mousedown: _onClick"></${prefix}ruler-controler>
  `,
  methods: {
    _onClick(e) {
      this.$dispatch('add:guide', {e:e, direction: this.direction, position: {horizon: 'y', vertical: 'x'}})
    }
  },
  paramAttributes: ['direction']
});

var Rulers = Vue.extend({
  data(){ 
    return { vertical: null, horizon: null, vpoint: null, hpoint: null, guidelines: null }
  },
  replace: true,
  created() {
    this._createRulers();
  },
  ready() {
    window.addEventListener('resize', _.debounce(this._createRulers, 500))
  },
  events: {
    'add:guide': '_onAddGuide'
  },
  methods: {
    _createRulers() {
      this.vertical = _.range(0, window.outerHeight, 2);
      this.horizon = _.range(0, window.outerWidth, 2);
      this.vpoint = _.range(50, window.outerHeight, 50);
      this.hpoint = _.range(50, window.outerWidth, 50);
    },
    setGuidelines(guidelines) {
      this.guidelines = guidelines;
    },
    _onAddGuide(e) {
      this.guidelines.$emit('add:guide', e);
    }
  },
  template: `
    <${prefix}ruler-vertical>
      <${prefix}ruler-point v-repeat="vpoint" v-component="ruler-point" direction="vertical"></${prefix}ruler-point>
      <${prefix}ruler-vertical-grid v-repeat="vertical" v-component="ruler-grid" direction="vertical"></${prefix}ruler-vertical-grid>
      <${prefix}ruler-controler v-component="ruler-controler" direction="vertical"></${prefix}ruler-controler>
    </${prefix}ruler-vertical>
    <${prefix}ruler-horizon>
      <${prefix}ruler-point v-repeat="hpoint" v-component="ruler-point" direction="horizon"></${prefix}ruler-point>
      <${prefix}ruler-horizon-grid v-repeat="horizon" v-component="ruler-grid" direction="horizon"></${prefix}ruler-horizon-grid>
      <${prefix}ruler-controler v-component="ruler-controler" direction="horizon"></${prefix}ruler-controler>
    </${prefix}ruler-horizon>
  `
});

var guidelines = new Guidelines({
  // data: {
  //   horizon: [
  //     60, 75, 80, 140
  //   ],
  //   vertical: [
  //     90, 120, 150, 300
  //   ]
  // }
});
var rulers = new Rulers();

guidelines.$mount();
guidelines.$appendTo('body');
rulers.$mount();
rulers.setGuidelines(guidelines);
rulers.$appendTo(`${prefix}rulers`);

})();
