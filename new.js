/**
 * 模拟new关键字实现 new 构造函数
 *
 *
 */

function objectFactory() {
  // 首先创建一个对象； 得到要 new 的对象
  var obj = new Object(),
    Constructor = [].shift.call(arguments);

  // 将obj 的隐式原型赋值为要new的对象的原型上
  obj.__proto__ = Constructor.prototype;

  // 得到构造函数的返回值
  var result = Constructor.apply(obj, arguments);

  // 根据返回值判断要返回什么
  return typeof result === "object" ? result : obj;
}

// test example

function Person(name, age) {
  this.strength = 60;
  this.age = age;
  return {
    name: name,
    habit: "Games",
  };
}

var person = objectFactory(Person, "Sunny", 18);

console.log(person.strength); // undefined
console.log(person.age); // undefined
console.log(person.name); // Sunny
console.log(person.habit); // Games

function Person2(name, age) {
  this.name = name;
  this.age = age;
}

var person2 = objectFactory(Person2, "Sunny", 18);

console.log(person2.name);
console.log(person2.age);
