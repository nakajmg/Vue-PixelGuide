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
