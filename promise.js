/**
 * 实现resolve reject 的Promise
 * 1. 执行 resolve -> fulfilled
 * 2. 执行 reject -> rejected
 * 3. Promise 状态改变后不可改变
 * 4. throw => reject
 * 5. 初始状态 pending
 *
 * 实现 then
 * 1. then接受两个回调函数： res, err
 * 2. resolve -> res, reject -> err
 * 3. resolve reject 在定时器中执行，等定时器执行完后再进行then
 * 4. then支持链式调用，下次then会受到上次影响
 *  1. then本身会返回promise对象
 *  2. 返回值为promise对象， success/fail -> 新的promise success/fail
 *  3. 返回值为!promise对象， 返回success val
 *
 * 实现 all race allSettled any
 * 1. all
 *  1. 接受promise数组，如果有非promise的值，返回成功
 *  2. 全部promise都成功，返回成功结果
 *  3. 如果有一个不成功，返回失败
 * 2. race
 *  1. 接受promise数组，如果有非promise的值，返回成功
 *  2. 返回最快得到结果的promise
 * 3. allSettled
 *  1. 接受promise数组，如果有非promise的值，返回成功
 *  2. 保存所有promise的结果，返回数组
 * 4. any
 *  1. 接受promise数组，如果有非promise的值，返回成功
 *  2. 如果有一个promise成功，返回成功
 *  3. 如果全部失败，报错
 */
class MyPromise {
  constructor(executor) {
    // 初始化状态
    this.initValue();
    // 绑定this
    this.initBind();
    // 执行传入的函数
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  initValue() {
    this.PromiseResult = null;
    this.PromiseState = "pending";
    this.onFulfilledCallbacks = []; // 成功的回调
    this.onRejectedCallbacks = []; // 失败的回调
  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    // state 不可变
    if (this.PromiseState !== "pending") return;
    // 状态改变
    this.PromiseResult = value;
    // 终值为传进来的值
    this.PromiseState = "fulfilled";

    // 执行保存成功的回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }

  reject(reason) {
    // state 不可变
    if (this.PromiseState !== "pending") return;
    // 状态改变
    this.PromiseResult = reason;
    // 终值为传进来的值
    this.PromiseState = "rejected";

    // 执行保存失败的回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }

  // then 的实现
  then(onFulfilled, onRejected) {
    // 参数校验，确保一定是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (res) => res;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(thhis.PromiseResult);

            if (x === thenPromise) {
              throw new Error("不能返回自身");
            }

            // 如果返回值是Promise success -> success fail -> fail
            if (x instanceof MyPromise) {
              // 等同于，只有then才知道promise返回结果是成功还是失败
              x.then(resolve, reject);
            } else {
              // 如果返回值是 !promise
              resolve(x);
            }
          } catch (error) {
            reject(error);
            throw new Error(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected));
      }
    });

    return thenPromise;
  }

  // all
  all(promiseList) {
    const result = [];
    let count = 0; // 成功的个数
    return new MyPromise((resolve, reject) => {
      const addData = (index, val) => {
        result[index] = val;
        count++;

        if (count === promiseList.length) {
          resolve(result);
        }
      };

      promiseList.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }

  // race
  race(promiseList) {
    return new MyPromise((resolve, reject) => {
      promiseList.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }

  // allSettled
  allSettiled(promiseList) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (status, val, i) => {
        if (status === "fulfilled") {
          result[i] = {
            status,
            value: val,
          };
        } else if (status === "rejected") {
          result[i] = {
            status,
            reason: val,
          };
        }

        count++;
        if (count === promiseList.length) {
          resolve(result);
        }
      };

      promiseList.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              addData("fulfilled", res, index);
            },
            (err) => {
              addData("rejected", err, index);
            }
          );
        } else {
          addData("fulfilled", promise, index);
        }
      });
    });
  }

  // any
  any(promiseList) {
    let count = 0;
    return new MyPromise((resolve, reject) => {
      promiseList.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              count++;
              if (count === promiseList.length) {
                reject("error");
              }
            }
          );
        } else {
          resolve(promise);
        }
      });
    });
  }
}
