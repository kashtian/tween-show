"use strict";

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Person =
  /*#__PURE__*/
  function () {
    function Person() {
      _classCallCheck(this, Person);

      this.name = 'jj1';
    }

    _createClass(Person, [{
      key: "getName",
      value: function getName() {
        return this.name;
      }
    }]);

    return Person;
  }();

// fmt: yyyy-MM-dd hh:mm:ss
function format(second, fmt, isMs) {
  if (isNaN(second) || !fmt) {
    return ''
  }
  var date = new Date(isMs ? second : second * 1000)
  var obj = {
    M: date.getMonth() + 1 + '',
    d: date.getDate() + '',
    h: date.getHours() + '',
    m: date.getMinutes() + '',
    s: date.getSeconds() + ''
  }
  fmt = fmt.replace(/y+/, date.getFullYear())
  for (let key in obj) {
    if (new RegExp(`(${key}+)`).test(fmt)) {
      if (RegExp.$1.length == 1) {
        fmt = fmt.replace(key, obj[key])
      } else {
        fmt = fmt.replace(RegExp.$1, obj[key] > 9 ? obj[key] : '0' + obj[key])
      }
    }
  }
  return fmt
}

"use strict";

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) { return typeof obj; };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; };
  return _setPrototypeOf(o, p);
}

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Person = function Person(name) {
  _classCallCheck(this, Person);

  this.name = name;
};

var Child =
  /*#__PURE__*/
  function (_Person) {
    _inherits(Child, _Person);

    function Child(name, age) {
      var _this;

      _classCallCheck(this, Child);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Child).call(this, name));
      _this.age = age;
      return _this;
    }

    return Child;
  }(Person);

var child = new Child('jack', 21)


var arr = []
function load() {
  if (!arr.length) {
    return
  }
  addScript(arr.shift(), load)
}

function addScript(src, cb) {
  let script = document.createElement('script')
  script.src = src
  script.onload = function () {
    cb && cb()
  }
  document.body.appendChild(script)
}

// call
function newcall() {
  var fn = arguments[0]
  var obj = arguments[1]
  obj.fn = fn
  var arr = []
  for (let i = 2; i < arguments.length; i++) {
    arr.push('arguments[' + i + ']')
  }
  eval('obj.fn(' + arr.join(',') + ')')
  delete obj.fn
}

Function.prototype.call2 = function (context) {
  context = context || window
  context.fn = this

  var args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }

  var result = eval('context.fn(' + args + ')')

  delete context.fn
  return result
}

Function.prototype.apply2 = function (context, arr) {
  context = context || window
  context.fn = this

  var result

  if (arr) {
    var args = []
    for (let i = 0; i < arr.length; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}

Function.prototype.bind2 = function (context) {
  context = context || window
  var fn = this
  var outArgs = arguments
  return function () {
    context.fn = fn
    var args = []
    for (let i = 1; i < outArgs.length; i++) {
      args.push('outArgs[' + i + ']')
    }
    for (let j = 0; j < arguments.length; j++) {
      args.push('arguments[' + j + ']')
    }
    var result = eval('context.fn(' + args + ')')
    delete context.fn
    return result
  }
}

Function.prototype.bind3 = function (context) {
  if (typeof this != 'function') {
    throw new Error('is not function')
  }
  var that = this
  var outArgs = [].slice.call2(arguments, 1)
  function empty() { }
  function fn() {
    var args = [].slice.call2(arguments).concat(outArgs)
    if (this instanceof fn) {
      return that.apply2(this, args)
    } else {
      return that.apply2(context, args)
    }
  }
  empty.prototype = this.prototype
  fn.prototype = new empty()
  return fn
}

function mynew(fn) {
  var obj = Object.create(fn.prototype)
  var result = fn.apply(obj, [].slice.call(arguments, 1))
  return typeof result == 'object' ? result : obj
}

// 继承
function Person(name) {
  this.name = name
}
Person.prototype.getName = function () {
  return this.name
}

function Child(name, age) {
  Person.call(this, name)
  this.age = age
}
Child.prototype = Object.create(Person.prototype)
Child.prototype.constructor = Child

// 判断对象相等
function eq(a, b, aStack, bStack) {
  if (a === b) {
    return true
  }
  if (a == null || b == null) {
    return false
  }
  if (a !== a) {
    return b !== b
  }
  if (typeof a != "object" || typeof b != "object") {
    return false
  }
  return deepEq(a, b, aStack, bStack)
}

var toString = Object.prototype.toString

function deepEq(a, b, aStack, bStack) {
  var className = toString.call(a)
  if (className != toString.call(b)) {
    return false
  }
  aStack = aStack || []
  bStack = bStack || []
  var slen = aStack.length
  while (slen--) {
    if (aStack[slen] === a) {
      return bStack[slen] === b
    }
  }
  aStack.push(a)
  bStack.push(b)

  if (className == '[object Array]') {
    var alen = a.length
    if (b.length != alen) {
      return false
    }
    while (alen--) {
      if (!eq(a[alen], b[alen], aStack, bStack)) {
        return false
      }
    }
  } else {
    var keys = Object.keys(a)
    var len = keys.length
    var key
    if (Object.keys(b).length != len) {
      return false
    }
    while (len--) {
      key = keys[len]
      if (!(b.hasOwnProperty(key) && eq(a[key], b[key], aStack, bStack))) {
        return false
      }
    }
  }
  console.log(aStack.toString(), bStack.toString())
  aStack.pop()
  bStack.pop()
  return true
}

executeContext = {
  'VO/AO': {
    arugments: { length: 0 },
    a: undefined,
    foo: reference to function foo() { },
d: reference to functionExpression "d"
  },
// 创建函数时就会初始化函数[[scope]]属性，保存作用域链,用于查找变量
Scope: ['VO/AO', parentContext.AO, globalContext.VO],
  // 从规范解读this, Reference, base, reference name, strict
  this: undefined
}

// 防抖
function debounce(fn, wait, immediate) {
  var timeid, result
  return function () {
    timeid && clearTimeout(timeid)

    if (immediate) {
      if (!timeid) {
        result = fn.apply(this, arguments)
      }
      timeid = setTimeout(() => {
        timeid = null
      }, wait)
    } else {
      timeid = setTimeout(() => {
        fn.apply(this, arguments)
      }, wait)
    }

    return result
  }
}

// 节流
function throttle(fn, wait) {
  var time = 0
  return function () {
    var now = Date.now()
    if (now - time < wait) {
      return
    }
    time = now
    fn.apply(this, arguments)
  }
}

// 节流定时器版
function throttle2(fn, wait) {
  var timer
  return function () {
    if (timer) {
      return
    }
    fn.apply(this, arguments)
    timer = setTimeout(() => {
      timer = null
    }, wait)
  }
}

// 节流第三版，第一次立刻执行，停止再执行一次
function throttle3(fn, wait) {
  var timer
  var previous = 0

  return function () {
    var now = Date.now()
    var remaining = wait - (now - previous)
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = now
      fn.apply(this, arguments)
    } else if (!timer) {
      timer = setTimeout(() => {
        previous = Date.now()
        timer = null
        fn.apply(this, arguments)
      }, remaining)
    }
  }
}

// 柯里化
function curry(fn, length) {
  length = length || fn.length
  return function () {
    if (arguments.length < length) {
      return curry(sub_curry.apply(this, [fn].concat([].slice.call(arguments))), length - arguments.length)
    } else {
      console.dir(fn)
      return fn.apply(this, arguments)
    }
  }
}

function sub_curry(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function curry2(fn, argso, holeso) {
  argso = argso || []
  holeso = holeso || []

  return function () {
    var args = argso.slice(0)
    var holes = holeso.slice(0)
    var argslen = args.length
    var holeslen = holes.length
    var index = 0
    var arg
    for (var i = 0; i < arguments.length; i++) {
      arg = arguments[i]
      if (arg === _ && holeslen) {
        index++
        if (index > holeslen) {
          args.push(arg)
          holes.push(argslen - 1 + index - holeslen)
        }
      } else if (arg === _) {
        args.push(arg)
        holes.push(argslen + i)
      } else if (holeslen) {
        if (index < holeslen) {
          args.splice(holes[index], 1, arg)
          holes.splice(index, 1)
        } else {
          args.push(arg)
        }
      } else {
        args.push(arg)
      }
    }
    if (holes.length || args.length < fn.length) {
      return curry2.call(this, fn, args, holes)
    } else {
      return fn.apply(this, args)
    }
  }
}

// 偏函数
function partial(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function partial2(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    var _args = args.slice(0)
    var pos = 0
    for (var i = 0, len = _args.length; i < len; i++) {
      if (_args[i] === _) {
        _args[i] = arguments[pos++]
      }
    }
    while (pos < arguments.length) {
      _args.push(arguments[pos++])
    }
    return fn.apply(this, _args)
  }
}

// 惰性函数(重写函数)
var foo = function () {
  var t = new Date()
  foo = function () {
    return t
  }
  return foo()
}

// 函数组合
function compose() {
  var fns = arguments
  return function () {
    var len = fns.length - 1
    var result = fns[len].apply(this, arugments)
    while (len--) {
      result = fns[len].call(this, result)
    }
    return result
  }
}

// 最大公约数
function GCD(a, b) {
  var temp
  while (b != 0) {
    temp = a % b
    a = b
    b = temp
  }
  return a
}

function GCD(a, b) {
  if (b == 0) {
    return a
  }
  return GCD(b, a % b)
}

// 阶乘
function factorial(n) {
  if (n < 2) {
    return 1
  }
  return n * factorial(n - 1)
}

function factorial(n, res = 1) {
  if (n < 2) {
    return res
  }
  return factorial(n - 1, n * res)
}

// 跟underscore学习写库函数
(function () {
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global) || this || {}

  var _ = function (obj) {
    if (!(this instanceof _)) {
      return new _(obj)
    }
    this._wrapped = obj
  }

  _.test = function () {
    console.log('test')
  }

  _.log = function () {
    console.log('log this--->', this)
  }
  // 自己写的，与underscore不同
  function mixin() {
    for (key in _) {
      if (_.hasOwnProperty(key)) {
        _.prototype[key] = function () {
          var args = [this.wrapped]
          Array.prototype.push.apply(args, arguments)
          return _[key].apply(_, args)
        }
      }
    }
  }

  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _
    }
    exports._ = _
  } else {
    root._ = _
  }
})()

// 模板引擎， 正则匹配并替换
function tmpl() {

}

// 策略模式，表单验证
var strategies = {
  mobileReg: /^1[^2]\d{9}$/,
  isNotEmpty(value, message) {
    if (!value) {
      return message || '不能为空'
    }
  },
  isMobile(value, message) {
    if (!strategies.mobileReg.test(value)) {
      return message || '手机号错误'
    }
  },
  minLength(value, length, message) {
    if (value.length < length) {
      return message || `长度小于${length}`
    }
  }
}

function Validator(map, obj) {
  this.map = map
  this.obj = obj
  this.rules = []

  this.init(map)
}

Validator.prototype = {
  constructor: Validator,
  init(map) {
    for (let key in map) {
      map[key].forEach(item => {
        this.add(key, item)
      })
    }
  },
  add(key, rule) {
    this.rules.push(() => {
      var strateAry = rule.strategy.split(':')
      var strategy = strateAry.shift()
      strateAry.unshift(this.obj[key])
      strateAry.push(rule.message)
      return strategies[strategy].apply(strategies, strateAry)
    })
  },
  start() {
    var errMsg
    for (var i = 0, len = this.rules.length; i < len; i++) {
      errMsg = this.rules[i]()
      if (errMsg) {
        return errMsg
      }
    }
  }
}

var obj = { name: '', psd: 0, mobile: '', test: '' }
function valiData() {
  var ruleMap = {
    name: [
      { strategy: 'isNotEmpty' }, 
      { strategy: 'minLength:6', message: '姓名不能小于6位数' }
    ],
    psd: [{ strategy: 'minLength:4' }],
    mobile: [{ strategy: 'isMobile' }]
  }
  var validator = new Validator(ruleMap, obj)
  valiData = function () {
    return validator.start()
  }
  return valiData()
}
valiData()

function getValidateFn(ruleMap, obj) {
  var validator = new Validator(ruleMap, obj)
  return function() {
    return validator.start()
  }
}
var valiData2 = getValidateFn({
  name: [
    { strategy: 'isNotEmpty' }, 
    { strategy: 'minLength:6', message: '姓名不能小于6位数' }
  ],
  psd: [{ strategy: 'minLength: 4' }],
  mobile: [{ strategy: 'isMobile' }]
}, obj)
valiData2()

function singleton(fn) {
  var result
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}

function mult() {
  var a = 1
  for (var i = 0, len = arguments.length; i < len; i++) {
    a = a * arguments[i]
  }
  return a
}

function cacheFn(fn) {
  var cache = {}
  return function() {
    var key = [].join.call(arguments)
    return cache[key] || (cache[key] = fn.apply(this, arguments))
  }
}

function Iterator(obj) {
  var i = 0
  var next = function() {
    i++
  }
  var getCurItem = function() {
    return obj[i]
  }
  var isDone = function() {
    return i == obj.length 
  }
  return {
    next,
    isDone,
    getCurItem
  }
}

function Chain(fn) {
  this.fn = fn
  this.successor = null
}
Chain.prototype.setNextSuccessor = function(successor) {
  this.successor = successor
}
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments)
  if (ret == 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }
  return ret
}
Chain.prototype.next = function() {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments)
}

function SignState(uploader) {
  this.uploader = uploader
}
SignState.prototype.button1Click = function() {
  console.log('扫描中，点击无效...')
}
SignState.prototype.button2Click = function() {
  console.log('文件正在扫描中，不能删除')
}

function Upload(fileName) {
  this.fileName = fileName
  this.button1 = null
  this.button2 = null
  this.state = 'sign'
  this.signState = new SignState(this)
}
Upload.prototype.init = function() {
  // init button
  var self = this
  this.currentState = this.signState
  this.button1.onclick = function() {
    self.currentState.button1Click()
  }
  this.button2.onclick = function() {
    self.currentState.button2Click()
  }
}
Upload.prototype.sign = function() {
  this.plugin.sign()
  this.currentState = this.signState
  this.button1.innerHTML = '扫描中，任何操作无效'
}

var uploader = new Upload('file')
window.external.upload = function(state) {
  uploader[state]()
}
window.external.upload('sign')

function Chain(fn) {
  this.fn = fn
  this.next = null
}

Chain.prototype.setNext = function(next) {
  this.next = next
}

Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments)
  if (ret == 'next') {
    return this.next && this.next.passRequest.apply(this, arguments)
  }
  return ret
}

var obj = new Chain(fn1)
var obj2 = new Chain(fn2)
obj.setNext(obj2)
obj.passRequest()

function createTree(data, keys) {
  var map = {}
  var res = []
  data.forEach(item => {
    let arr = res
    let cur = map
    let value = null
    keys.forEach((key, index) => {
      value = item[key]
      if (!cur[value]) {
        arr.push({
          value: value,
          children: index != keys.length - 1 ? [] : null
        })
        cur[value] = {pos: arr.length - 1}
      } 
      cur = cur[value]
      arr = arr[cur.pos].children
    })
  })
  return res
}

var data = [{
  "province": "浙江",
  "city": "杭州",
  "name": "西湖"
}, {
  "province": "四川",
  "city": "成都",
  "name": "锦里"
}, {
  "province": "四川",
  "city": "成都",
  "name": "方所"
}, {
  "province": "四川",
  "city": "阿坝",
  "name": "九寨沟"
}]
// 递归组合(不知道是不是记得的缘故，等忘了再写一次吧)
function toNode(obj, [key, ...rest], res = {}) {
  if (res.value == null) {
    res.value = obj[key]
    if (rest.length != 0) {
      res.children = toList(obj, rest)
    }
  } else {
    toList(obj, rest, res.children)
  }
  return res
}

function toList(obj, keys, arr = []) {
  let value = obj[keys[0]]
  let target = arr.find(item => item.value == value)
  if (target) {
    toNode(obj, keys, target)
  } else {
    arr.push(toNode(obj, keys))
  }
  return arr
}

function toTree(data, keys) {
  return data.reduce((res, item) => {
    return toList(item, keys, res)
  }, [])
}

var goods = [
  {
    weight: 2,
    price: 6
  },
  {
    weight: 2,
    price: 3
  },
  {
    weight: 6,
    price: 5
  },
  {
    weight: 5,
    price: 4
  },
  {
    weight: 4,
    price: 6
  }
]
// 背包问题 f[i,j] = Max{f[i-1,j], f[i-1, j-wi] + pi}
function bags(goods, total) {
  let f = {}
  let item
  for (let j = 1; j <= total; j++) {
    for (let i = 0, len = goods.length; i < len; i++) {
      item = goods[i]
      f[`${i},${j}`] = Math.max(f[`${i-1},${j}`] || 0, calc(i, j, item, f))
    }
  }

  console.log('f---->', f)
  return findAnswer(goods, total, f)
}
function calc(i, j, item, f) {
  if (j - item.weight < 0) {
    return 0
  }
  return (f[`${i-1},${j-item.weight}`] || 0) + item.price
}
function findAnswer(goods, total, f) {
  let arr = []
  let item
  for (let i = goods.length - 1; i >= 0; i--) {
    if (total == 0) {
      break
    }
    item = goods[i]
    if (f[`${i},${total}`] - (f[`${i-1},${total - item.weight}`] || 0) == item.price) {
      arr.push(item)
      total -= item.weight
    }
  }
  return arr
}

// 瀑布流最小高度差问题（有一个数组，将数组分成n份，每份求和，如何使每份和的差最小)
function flow(arr, col) {
  let res = []
  let avg = arr.reduce((res, value) => res + value, 0) / col
  for (let i = 0; i < col; i++) {
    res[i] = bagsPic(arr, avg)
    arr = arr.filter(item => {
      return res[i].indexOf(item) < 0
    })
  }
  return res
}

function bagsPic(arr, total) {
  let count = 0
  let res = []
  for (let i = 0, len = arr.length; i < len; i++) {
    if (count > total) {
      return res
    }
    count += arr[i]
    res.push(arr[i])
  }
  return res
}
