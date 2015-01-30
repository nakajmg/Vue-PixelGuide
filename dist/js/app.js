"use strict";

Vue.component("l-horizon", {
  data: function data() {
    return { direction: "horizon", isEnter: false, isDragged: false, y: null };
  },
  template: "\n    <horizon \n      v-on=\"mousedown: _onMouseDown, mouseup: _onMouseUp, mouseenter: _onMouseEnter, mouseleave: _onMouseLeave\"\n      v-style=\"left: $value + 'px'\"\n    >\n      <info v-show=\"isEnter || isDragged\" v-style=\"top: y + 'px'\">X:{{$value}}px</info>\n    </horizon>\n  ",
  methods: {
    _onMouseDown: function OnMouseDown() {
      this.isDragged = true;
      this.$dispatch("start:drag", this);
    },
    _onMouseUp: function OnMouseUp() {
      this.isDragged = false;
      this.$dispatch("end:drag", this);
    },
    _onMouseEnter: function OnMouseEnter(e) {
      this.isEnter = true;
      this.y = e.y;
    },
    _onMouseLeave: function OnMouseLeave() {
      this.isEnter = false;
    }
  } });

Vue.component("l-vertical", {
  data: function data() {
    return { direction: "vertical", isEnter: false, isDragged: false, x: null };
  },
  template: "\n    <vertical v-on=\"mousedown: _onMouseDown, mouseup: _onMouseUp, mouseenter: _onMouseEnter, mouseleave: _onMouseLeave\"\n      v-style=\"top: $value + 'px'\"\n    >\n      <info v-show=\"isEnter || isDragged\" v-style=\"left: x + 'px'\">Y:{{$value}}px</info>\n    </vertical>\n  ",
  methods: {
    _onMouseDown: function OnMouseDown() {
      this.isDragged = true;
      this.$dispatch("start:drag", this);
    },
    _onMouseUp: function OnMouseUp() {
      this.isDragged = false;
      this.$dispatch("end:drag", this);
    },
    _onMouseEnter: function OnMouseEnter(e) {
      this.isEnter = true;
      this.x = e.x;
    },
    _onMouseLeave: function OnMouseLeave() {
      this.isEnter = false;
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
  template: "\n    <px-guide v-on=\"mousemove: _onMouseMove, mouseup: _onEndDrag\">\n      <template v-repeat=\"horizon\" v-component=\"l-horizon\"></template>\n      <template v-repeat=\"vertical\" v-component=\"l-vertical\"></template>\n    </px-guide>\n  ",
  methods: {
    _onMouseMove: function OnMouseMove(e) {
      if (!this.isDragged) return;
      if (this.current.direction === "horizon") {
        this.current.$value = e.x;
      } else {
        this.current.$value = e.y;
      }
    },
    _onStartDrag: function OnStartDrag(target) {
      this.current = target;
      this.isDragged = true;
    },
    _onEndDrag: function OnEndDrag() {
      this.isDragged = false;
      this.current = null;
    }
  }
});

vm.$mount();
vm.$appendTo("body");