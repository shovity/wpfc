const rules = require ('./rules')

var findMin = function (fuzzyWater, fuzzyTemperature) {
  return fuzzyWater <= fuzzyTemperature ? fuzzyWater : fuzzyTemperature;
}

var fuzzySolving = function (waterlvl, temperature) {
  let inputFuzzing = 0;
  let caculateMultiply = 0;

  for (let i = 0; i < rules.length; i++) {
    let min = findMin(rules[i].waterlvl(waterlvl), rules[i].temperature(temperature));

    inputFuzzing += min;
    caculateMultiply += (min * rules[i].angle);
  }

  return caculateMultiply / inputFuzzing;
}

module.exports = fuzzySolving;
