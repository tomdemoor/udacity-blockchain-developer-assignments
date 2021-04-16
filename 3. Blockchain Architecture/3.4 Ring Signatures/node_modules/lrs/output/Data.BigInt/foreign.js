// module Data.BigInt

var bigInt = require("big-integer");

exports["fromBase'"] = function(just) {
  return function(nothing) {
    return function(b) {
      return function(s) {
        try {
          var x = bigInt(s, b);
          return just(x);
        } catch (err) {
          return nothing;
        }
      };
    };
  };
};

exports.fromInt = bigInt;

exports.toBase = function(b){
  return function(x) {
    return x.toString(b);
  };
};

exports.toString = function(x) {
  return x.toString();
};

exports.toNumber = function(x) {
  return x.toJSNumber();
};

exports.biAdd = function(x) {
  return function(y) {
    return x.add(y);
  };
};

exports.biMul = function(x) {
  return function(y) {
    return x.multiply(y);
  };
};

exports.biSub = function(x) {
  return function(y) {
    return x.minus(y);
  };
};

exports.biMod = function(x) {
  return function(y) {
    return x.mod(y);
  };
};

exports.biDiv = function(x) {
  return function(y) {
    return x.divide(y);
  };
};

exports.biEquals = function(x) {
  return function(y) {
    return x.equals(y);
  };
};

exports.biCompare = function(x) {
  return function(y) {
    return x.compare(y);
  };
};

exports.abs = function(x) {
  return x.abs();
};

exports.even = function(x) {
  return x.isEven();
};

exports.odd = function(x) {
  return x.isOdd();
};

exports.positive = function(x) {
  return x.isPositive();
};

exports.negative = function(x) {
  return x.isNegative();
};


exports.prime = function(x) {
  return x.isPrime();
};

exports.pow = function(x) {
  return function(y) {
    return x.pow(y);
  };
};

exports.modPow = function(x){
  return function(y){
    return function(z){
      return x.modPow(y,z);
    };
  };
};
