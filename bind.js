/**
 * bind 会创建一个新函数，当新函数被调用时，bind() 的第一个参数作为运行时的this，后续参数作为参数
 *
 * 1. 返回一个函数
 * 2. 也可以传入参数
 */

Function.prototype.bind2 = function (that, ...args) {

  if(typeof this !== 'function') {
    throw new Error('this的绑定不能为非函数的内容')
  }

  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);

  function fNOP (){}

  function fBound() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : that,
      args.concat(bindArgs)
    );
  }
  
  fNOP.prototype = this.prototype
  fBound.prototype = new fNOP()
  return fBound;
};
