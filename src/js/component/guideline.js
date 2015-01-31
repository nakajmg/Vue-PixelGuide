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
