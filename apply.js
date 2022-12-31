Function.prototype.apply2 = function (that, arr) {
  const context = that || window;

  context.fn = this;

  const result = context.fn(...arr);

  delete context.fn;

  return result;
};

Function.prototype.apply3 = function (that, arr) {
  if (typeof that === "undefined" || that === null) {
    that = window;
  }

  const fnSymbol = Symbol();

  that[fnSymbol] = this;

  const result = that[fnSymbol](...arr);

  delete that[fnSymbol];

  return result;
};
