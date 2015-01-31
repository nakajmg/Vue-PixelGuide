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
