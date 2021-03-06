"use strict";

(function () {
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
      info: "<" + prefix + "info v-show=\"isEnter || isDragged\" v-style=\"top: y + 'px', left: x + 'px'\">\n        <" + prefix + "position>{{left}}{{top}}</" + prefix + "position>\n      </" + prefix + "info>"
    },
    template: "<" + prefix + "guideline v-partial=\"line\"></" + prefix + "guideline>",
    events: {
      move: "_onMove",
      init: "_onInit"
    },
    methods: {
      _onMove: function OnMove(e) {
        var moveTo = this.moveTo[this.direction];
        this.$value = "" + e[moveTo];
      },
      _onChange$value: function OnChange$value() {
        this[this.position[this.direction]] = this.$value;
      },
      _onInit: function OnInit(e) {
        this.isEnter = true;
        this[this.direction] = e[this.direction];
      }
    }
  });

  Vue.component("ruler-grid", {
    paramAttributes: ["direction"],
    data: function data() {
      return { isPoint: null, isScale: null, top: null, left: null, position: { vertical: "top", horizon: "left" } };
    },
    template: "\n    <" + prefix + "ruler-grid v-style=\"top: top + 'px', left: left + 'px'\" v-attr=\"" + prefix + "ruler-grid-point: isPoint, " + prefix + "ruler-grid-scale: isScale\"></" + prefix + "ruler-grid>\n  ",
    compiled: function compiled() {
      if (!this.$value) return;
      this[this.position[this.direction]] = this.$value;
      this.isPoint = !(this.$value % 50);
      this.isScale = !(this.$value % 10);
    }
  });

  Vue.component("ruler-point", {
    paramAttributes: ["direction"],
    data: function data() {
      return { top: null, left: null, position: { vertical: "top", horizon: "left" } };
    },
    template: "\n    <" + prefix + "ruler-point-value v-style=\"top: top + 'px', left: left + 'px'\">{{$value}}</" + prefix + "ruler-point-value>\n  ",
    compiled: function compiled() {
      if (!this.$value) return;
      this[this.position[this.direction]] = this.$value;
    }
  });

  var Guidelines = Vue.extend({
    data: function data() {
      return {
        isDragged: null,
        current: null,
        horizon: [],
        vertical: []
      };
    },
    replace: true,
    template: "\n    <" + prefix + "guide v-on=\"mousemove: _onMouseMove, mouseup: _onEndDrag\">\n      <" + prefix + "rulers></" + prefix + "rulers>\n      <horizon v-repeat=\"horizon\" v-component=\"guideline\" direction=\"x\" v-ref=\"horizon\"></horizon>\n      <vertical v-repeat=\"vertical\" v-component=\"guideline\" direction=\"y\" v-ref=\"vertical\"></vertical>\n    </" + prefix + "guide>\n  ",
    events: {
      "start:drag": "_onStartDrag",
      "end:drag": "_onEndDrag",
      "add:guide": "_onAddGuide"
    },
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
      },
      _onAddGuide: function OnAddGuide(opt) {
        var _this2 = this;
        var e = opt.e;
        var direction = opt.direction;
        var position = opt.position[direction];
        this[direction].push(e[position]);
        setTimeout(function () {
          _this2.current = _this2.$[direction][_this2[direction].length - 1];
          _this2.current.$emit("init", e);
          _this2.isDragged = true;
        }, 0);
      }
    }
  });

  Vue.component("ruler-controler", {
    replace: true,
    template: "\n    <" + prefix + "ruler-controler v-on=\"mousedown: _onClick\"></" + prefix + "ruler-controler>\n  ",
    methods: {
      _onClick: function OnClick(e) {
        this.$dispatch("add:guide", { e: e, direction: this.direction, position: { horizon: "y", vertical: "x" } });
      }
    },
    paramAttributes: ["direction"]
  });

  var Rulers = Vue.extend({
    data: function data() {
      return { vertical: null, horizon: null, vpoint: null, hpoint: null, guidelines: null };
    },
    replace: true,
    created: function created() {
      this._createRulers();
    },
    ready: function ready() {
      window.addEventListener("resize", _.debounce(this._createRulers, 500));
    },
    events: {
      "add:guide": "_onAddGuide"
    },
    methods: {
      _createRulers: function CreateRulers() {
        this.vertical = _.range(0, window.outerHeight, 2);
        this.horizon = _.range(0, window.outerWidth, 2);
        this.vpoint = _.range(50, window.outerHeight, 50);
        this.hpoint = _.range(50, window.outerWidth, 50);
      },
      setGuidelines: function setGuidelines(guidelines) {
        this.guidelines = guidelines;
      },
      _onAddGuide: function OnAddGuide(e) {
        this.guidelines.$emit("add:guide", e);
      }
    },
    template: "\n    <" + prefix + "ruler-vertical>\n      <" + prefix + "ruler-point v-repeat=\"vpoint\" v-component=\"ruler-point\" direction=\"vertical\"></" + prefix + "ruler-point>\n      <" + prefix + "ruler-vertical-grid v-repeat=\"vertical\" v-component=\"ruler-grid\" direction=\"vertical\"></" + prefix + "ruler-vertical-grid>\n      <" + prefix + "ruler-controler v-component=\"ruler-controler\" direction=\"vertical\"></" + prefix + "ruler-controler>\n    </" + prefix + "ruler-vertical>\n    <" + prefix + "ruler-horizon>\n      <" + prefix + "ruler-point v-repeat=\"hpoint\" v-component=\"ruler-point\" direction=\"horizon\"></" + prefix + "ruler-point>\n      <" + prefix + "ruler-horizon-grid v-repeat=\"horizon\" v-component=\"ruler-grid\" direction=\"horizon\"></" + prefix + "ruler-horizon-grid>\n      <" + prefix + "ruler-controler v-component=\"ruler-controler\" direction=\"horizon\"></" + prefix + "ruler-controler>\n    </" + prefix + "ruler-horizon>\n  "
  });

  var guidelines = new Guidelines({});
  var rulers = new Rulers();

  guidelines.$mount();
  guidelines.$appendTo("body");
  rulers.$mount();
  rulers.setGuidelines(guidelines);
  rulers.$appendTo("" + prefix + "rulers");
})();
// data: {
//   horizon: [
//     60, 75, 80, 140
//   ],
//   vertical: [
//     90, 120, 150, 300
//   ]
// }