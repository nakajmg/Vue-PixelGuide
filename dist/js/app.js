"use strict";

var prefix = "px-";
Vue.directive("" + prefix + "guideline", {
  bind: function bind() {
    var _this = this;
    this._onMouseEnter = function (e) {
      _this.vm.isEnter = true;
      _this.vm[_this.vm.direction] = e[_this.vm.direction];
    };
    this._onMouseLeave = function () {
      _this.vm.isEnter = false;
    };
    this._onMouseDown = function () {
      _this.vm.isDragged = true;
      _this.vm.$dispatch("start:drag", _this.vm);
    };
    this._onMouseUp = function () {
      _this.vm.isDragged = false;
      _this.vm.$dispatch("end:drag", _this.vm);
    };
    this.el.addEventListener("mouseenter", this._onMouseEnter);
    this.el.addEventListener("mouseleave", this._onMouseLeave);
    this.el.addEventListener("mousedown", this._onMouseDown);
    this.el.addEventListener("mouseup", this._onMouseUp);
  }
});

Vue.component("guideline", {
  paramAttributes: ["direction"],
  data: function data() {
    return { direction: null, left: null, top: null, isEnter: false, isDragged: false, x: null, y: null, position: { x: "top", y: "left" }, moveTo: { x: "y", y: "x" } };
  },
  compiled: function compiled() {
    this.$watch("$value", this._onChange$value, false, true);
  },
  replace: true,
  partials: {
    line: "<" + prefix + "line v-" + prefix + "guideline v-style=\"left: left + 'px', top: top + 'px'\" v-partial=\"info\"></" + prefix + "line>",
    info: "<" + prefix + "info v-show=\"isEnter || isDragged\" v-style=\"top: y + 'px', left: x + 'px'\">\n        <" + prefix + "position v-if=\"left\">X:{{left}}px</" + prefix + "position>\n        <" + prefix + "position v-if=\"top\">Y:{{top}}px</" + prefix + "position>\n      </" + prefix + "info>"
  },
  template: "<" + prefix + "guideline v-partial=\"line\"></" + prefix + "guideline>",
  events: {
    move: "_onMove"
  },
  methods: {
    _onMove: function OnMove(e) {
      var moveTo = this.moveTo[this.direction];
      this.$value = e[moveTo];
    },
    _onChange$value: function OnChange$value() {
      this[this.position[this.direction]] = this.$value;
    }
  }
});

var vm = new Vue({
  events: {
    "start:drag": "_onStartDrag",
    "end:drag": "_onEndDrag"
  },
  data: {
    isDragged: false,
    current: null,
    horizon: [10, 15, 20, 30],
    vertical: [4, 8, 20, 30]
  },
  replace: true,
  template: "\n    <" + prefix + "guide v-on=\"mousemove: _onMouseMove, mouseup: _onEndDrag\">\n      <horizon v-repeat=\"horizon\" v-component=\"guideline\" direction=\"x\"></horizon>\n      <vertical v-repeat=\"vertical\" v-component=\"guideline\" direction=\"y\"></vertical>\n    </" + prefix + "guide>\n  ",
  methods: {
    _onMouseMove: function OnMouseMove(e) {
      if (!this.isDragged || !this.current) return;
      this.current.$emit("move", e);
    },
    _onStartDrag: function OnStartDrag(vm) {
      this.current = vm;
      this.isDragged = true;
    },
    _onEndDrag: function OnEndDrag() {
      this.current = null;
      this.isDragged = false;
    }
  }
});

vm.$mount();
vm.$appendTo("body");