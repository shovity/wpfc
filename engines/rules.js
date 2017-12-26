var aClose = 0;
var aSmall = 30;
var aMideum = 60;
var aBig = 90;

var nLow = function (waterlvl) {
  if (waterlvl <= 300) return 1;
  else if (waterlvl >= 500) return 0;
  else return (500 - waterlvl) / 200;
}

var nAverage = function (waterlvl) {
  if (waterlvl <= 300 || waterlvl >= 800) return 0;
  else if (waterlvl >= 500 && waterlvl <= 700) return 1;
  else if (waterlvl > 300 && waterlvl < 500) return (waterlvl - 300) / 200;
  else return (800 - waterlvl) / 100;
}

var nHigh = function (waterlvl) {
  if (waterlvl <= 700) return 0;
  else if (waterlvl >= 800) return 1;
  else return (waterlvl - 700) / 100;
}

var tmLow = function (temperature) {
  if (temperature <= 10) return 1;
  else if (temperature >= 20) return 0;
  else return (20 - temperature) / 10;
}

var tmAverage = function (temperature) {
  if (temperature <= 10 || temperature >= 30) return 0;
  else if (temperature >= 20 && temperature <= 25) return 1;
  else if (temperature > 10 && temperature < 20) return (temperature - 10) / 10;
  else return (30 - temperature) / 5;
}

var tmHigh = function (temperature) {
  if (temperature <= 25) return 0;
  else if (temperature >= 30) return 1;
  else return (temperature - 25) / 5;
}

// var dependent = [nLow, nAverage, nHigh, tmLow, tmAverage, tmHigh];
// var angle = [aSmall, aMideum, aBig];

var rules = [
  {
    waterlvl: nLow,
    temperature: tmLow,
    angle: aMideum
  },
  {
    waterlvl: nLow,
    temperature: tmAverage,
    angle: aBig
  },
  {
    waterlvl: nLow,
    temperature: tmHigh,
    angle: aBig
  },
  {
    waterlvl: nAverage,
    temperature: tmLow,
    angle: aSmall
  },
  {
    waterlvl: nAverage,
    temperature: tmAverage,
    angle: aMideum
  },
  {
    waterlvl: nAverage,
    temperature: tmHigh,
    angle: aMideum
  },
  {
    waterlvl: nHigh,
    temperature: tmLow,
    angle: aClose
  },
  {
    waterlvl: nHigh,
    temperature: tmAverage,
    angle: aClose
  },
  {
    waterlvl: nHigh,
    temperature: tmHigh,
    angle: aClose
  }
];

module.exports = rules;
