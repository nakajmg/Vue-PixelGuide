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
