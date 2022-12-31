/**
 * 手写 call
 * call的流程
 * 1. 将函数设置对象的属性
 * 2. 执行所谓该函数
 * 3. 删除该函数
 *
 *
 * example:
 * var foo = {
 *  value : 1
 * }
 *
 * function bar () {
 *  console.log(this.value)
 * }
 *
 * bar.call(foo) // 1
 *
 * 大概就是转换为
 * var foo = {
 *  value : 1,
 *  bar: function () {
 *    console.log(this.value)
 *  }
 * }
 *
 * foo.bar()
 */

// 方式1
Function.prototype.call2 = function (that) {
  // 首先，获取调用call的函数， 可以用this获取
  const context = that || window;

  // 给that赋值执行函数fn为 this
  context.fn = this;

  // 获取函数需要的参数
  let arg = [...arguments].slice(1);

  // 执行fn,并得到函数的返回结果
  const result = context.fn(...arg);

  // 删除fn
  delete context.fn;

  // 返回result
  return result;
};

// es6 写法
Function.prototype.call3 = function (that, ...args) {

  if(typeof that === 'undefined' || that === null) {
    that = window
  }

  const fnSymbol = Symbol()

  that[fnSymbol] = this;

  const result = that[fnSymbol](...args);

  delete that[fnSymbol]

  return result
}




// test example

const value = 2;

const obj = {
  value: 1,
};

console.log("window.value", window.value);

function bar(name, age) {
  return {
    name,
    age,
    value: this.value,
  };
}

const result1 = bar.call2(null);
const result2 = bar.call2(obj, "Sunny", 18);

console.log("result1", result1);
console.log("result2", result2);
