function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的prototype
  let prototype = right.prototype

  // 判断构造函数的 prototype 是否在对象的原型上
  while (true) {
    // 找到最后没有返回 false
    if(!proto) return false
    // 在了返回 true
    if(proto === prototype) return true
    // 不在，继续向上查找
    proto = Object.getPrototypeOf(proto)
  }
}