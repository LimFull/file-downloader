import {ChartIndex} from "./types";

export function fixed(num: number | string, to = 10): number {
  if (typeof num === 'string') {
    return Number(Number(num).toFixed(to))
  }

  return Number(num.toFixed(to))
}

export function changePercent(rows: any, index: ChartIndex) {
  const changes: (number | 'NaN')[] = []

  for (let i = 0; i < rows.length; i++) {
    if (i === 0) {
      changes.push('NaN')
      continue
    }
    const prevClose = +rows[i - 1].split(',')[index]
    const currClose = +rows[i].split(',')[index]

    changes.push(fixed((currClose - prevClose) / prevClose * 100))
  }
  return changes
}


export function changeAbs(rows: any, index: ChartIndex) {
  const changes: (number | 'NaN')[] = []

  for (let i = 0; i < rows.length; i++) {
    if (i === 0) {
      changes.push('NaN')
      continue
    }
    const prevClose = +rows[i - 1].split(',')[index]
    const currClose = +rows[i].split(',')[index]

    changes.push(fixed((currClose - prevClose)))
  }
  return changes
}


export function calculateEMAVolume(rows: any, period: number) {
  const emaArray: number[] = [];

  // Calculate the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    // close
    const row = rows[i].split(',')
    sum = Number((sum + +row[ChartIndex.VOLUME]).toFixed(10));
  }
  const firstEMA = Number((sum / period).toFixed(10));
  emaArray.push(firstEMA);

  // Calculate the weighting multiplier
  const multiplier = Number((2 / (period + 1)).toFixed(10));

  // Calculate the subsequent EMAs
  for (let i = period; i < rows.length; i++) {
    const row = rows[i].split(',')
    const close = +row[ChartIndex.VOLUME]
    const currentEMA: number = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
    emaArray.push(currentEMA);
  }

  for (let i = 0; i < rows.length; i++) {
    const volume = +rows[i].split(',')[ChartIndex.VOLUME]
    emaArray[i] = fixed((volume - emaArray[i]) / emaArray[i] * 100)
  }

  return emaArray;
}


export function calculateEMA(rows: any, period: number) {
  const emaArray: number[] = [];

  // Calculate the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    // close
    const row = rows[i].split(',')
    sum = Number((sum + +row[ChartIndex.CLOSE]).toFixed(10));
  }
  const firstEMA = Number((sum / period).toFixed(10));
  emaArray.push(firstEMA);

  // Calculate the weighting multiplier
  const multiplier = Number((2 / (period + 1)).toFixed(10));

  // Calculate the subsequent EMAs
  for (let i = period; i < rows.length; i++) {
    const row = rows[i].split(',')
    const close = +row[ChartIndex.CLOSE]
    const currentEMA: number = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
    emaArray.push(currentEMA);
  }

  for (let i = 0; i < rows.length; i++) {
    const close = +rows[i].split(',')[ChartIndex.CLOSE]
    emaArray[i] = fixed((close - emaArray[i]) / emaArray[i] * 100)
  }
  return emaArray;
}

export function calculateEMAAbs(rows: any, period: number, index: ChartIndex) {
  const emaArray: number[] = [];

  // Calculate the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    // close
    const row = rows[i].split(',')
    sum = Number((sum + +row[index]).toFixed(10));
  }
  const firstEMA = Number((sum / period).toFixed(10));
  emaArray.push(firstEMA);

  // Calculate the weighting multiplier
  const multiplier = Number((2 / (period + 1)).toFixed(10));

  // Calculate the subsequent EMAs
  for (let i = period; i < rows.length; i++) {
    const row = rows[i].split(',')
    const close = +row[index]
    const currentEMA: number = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
    emaArray.push(currentEMA);
  }

  return emaArray;
}


export function calculateSMAVolume(rows: any, period: number) {
  const smaArray = [];

  // Calculate the first SMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    const row = rows[i].split(',')
    sum = Number((sum + +row[ChartIndex.VOLUME]).toFixed(10));
  }
  const firstSMA = sum / period;
  smaArray.push(firstSMA);

  // Calculate the subsequent SMAs
  for (let i = period; i < rows.length; i++) {
    const pastVolume = rows[i - period].split(',')[ChartIndex.VOLUME]
    const currVolume = rows[i].split(',')[ChartIndex.VOLUME]

    sum = Number((sum - +pastVolume + +currVolume).toFixed(10));
    const currentSMA = Number((sum / period).toFixed(10));
    smaArray.push(fixed(currentSMA));
  }

  for (let i = 0; i < rows.length; i++) {
    const volume = +rows[i].split(',')[ChartIndex.VOLUME]
    smaArray[i] = fixed((volume - smaArray[i]) / smaArray[i] * 100)
  }

  return smaArray;
}

export function calculateSMA(rows: any, period: number) {
  const smaArray = [];

  // Calculate the first SMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    const row = rows[i].split(',')
    sum = Number((sum + +row[ChartIndex.CLOSE]).toFixed(10));
  }
  const firstSMA = sum / period;
  smaArray.push(firstSMA);

  // Calculate the subsequent SMAs
  for (let i = period; i < rows.length; i++) {
    const pastClose = rows[i - period].split(',')[ChartIndex.CLOSE]
    const currClose = rows[i].split(',')[ChartIndex.CLOSE]

    sum = Number((sum - +pastClose + +currClose).toFixed(10));
    const currentSMA = Number((sum / period).toFixed(10));
    smaArray.push(currentSMA);
  }

  for (let i = 0; i < rows.length; i++) {
    const close = +rows[i].split(',')[ChartIndex.CLOSE]
    smaArray[i] = fixed((close - smaArray[i]) / smaArray[i] * 100)
  }

  return smaArray;
}

export function calculateSMAAbs(rows: any, period: number, index: ChartIndex) {
  const smaArray = [];

  // Calculate the first SMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    const row = rows[i].split(',')
    sum = Number((sum + +row[index]).toFixed(10));
  }
  const firstSMA = sum / period;
  smaArray.push(firstSMA);

  // Calculate the subsequent SMAs
  for (let i = period; i < rows.length; i++) {
    const pastClose = rows[i - period].split(',')[index]
    const currClose = rows[i].split(',')[index]

    sum = Number((sum - +pastClose + +currClose).toFixed(10));
    const currentSMA = Number((sum / period).toFixed(10));
    smaArray.push(currentSMA);
  }

  return smaArray;
}


export function calculateMACD(rows: any, fast: number, slow: number) {
  const macdData = [];
  const signalData = [];
  const histogramData = [];
  let ema12 = 0;
  let ema26 = 0;
  let signal = 0;

  for (let i = 0; i < rows.length; i++) {
    const close = +rows[i].split(',')[ChartIndex.CLOSE];

    if (i === 0) {
      ema12 = close;
      ema26 = close;
    } else {
      ema12 = Number(((close * (2 / (fast + 1))) + (ema12 * (1 - (2 / (fast + 1))))).toFixed(10));
      ema26 = Number(((close * (2 / (slow + 1))) + (ema26 * (1 - (2 / (slow + 1))))).toFixed(10));
    }

    const macd = Number((ema12 - ema26).toFixed(10));
    macdData.push(fixed(macd / close * 100));

    if (i < 8) {
      signalData.push('NaN');
      histogramData.push('NaN');
    } else {
      if (i === 8) {
        signal = macd;
      } else {
        signal = Number(((macd * (2 / (9 + 1))) + (signal * (1 - (2 / (9 + 1))))).toFixed(10));
      }
      signalData.push(fixed(signal / close * 100));
      histogramData.push(Number((macd - signal).toFixed(10)));
    }
  }

  return {
    macdData,
    signalData,
    histogramData
  };
}

export function calculateMACDAbs(rows: any, fast: number, slow: number, period: number) {
  const macdData = [];
  const signalData = [];
  const histogramData = [];
  let fastEma = 0;
  let slowEma = 0;
  let signal = 0;

  for (let i = 0; i < rows.length; i++) {
    const close = +rows[i].split(',')[ChartIndex.CLOSE];

    if (i === 0) {
      fastEma = close;
      slowEma = close;
    } else {
      fastEma = Number(((close * (2 / (fast + 1))) + (fastEma * (1 - (2 / (fast + 1))))).toFixed(10));
      slowEma = Number(((close * (2 / (slow + 1))) + (slowEma * (1 - (2 / (slow + 1))))).toFixed(10));
    }

    const macd = Number((fastEma - slowEma).toFixed(10));
    macdData.push(macd);

    if (i < period - 1) {
      signalData.push('NaN');
      histogramData.push('NaN');
    } else {
      if (i === period - 1) {
        signal = macd;
      } else {
        signal = fixed((macd * (2 / (period + 1))) + (signal * (1 - (2 / (period + 1)))));
      }
      signalData.push(signal);
      histogramData.push(fixed(macd - signal));
    }
  }

  return {
    macdData,
    signalData,
    histogramData
  };
}


export function calculateRSI(rows: any, period: number) {
  let gains = [];
  let losses = [];
  let avgGain, avgLoss, rsiArray = [];

  for (let i = 0; i < rows.length; i++) {
    let currentCandle = rows[i];
    let previousCandle = rows[i - 1];

    if (previousCandle) {
      const change = fixed(+currentCandle.split(',')[ChartIndex.CLOSE] - +previousCandle.split(',')[ChartIndex.CLOSE]);
      if (change > 0) {
        gains.push(change);
      } else if (change < 0) {
        losses.push(-change);
      }
    }

    if (i >= period) {
      avgGain = fixed(gains.slice(-period).reduce((sum, value) => sum + value, 0) / period);
      avgLoss = fixed(losses.slice(-period).reduce((sum, value) => sum + value, 0) / period);
      const rsi = fixed(100 - (100 / (1 + (avgGain / avgLoss))));
      rsiArray.push(rsi);
    } else {
      rsiArray.push('NaN');
    }
  }

  return rsiArray;
}


function movingAverage(values: any, period: number) {
  let n = values.length;
  let results = [];
  for (let i = 0; i < n; i++) {
    let avg = 0;
    let count = 0;
    for (let j = Math.max(i - period + 1, 0); j <= i; j++) {
      avg += values[j];
      count++;
    }
    results.push(avg / count);
  }
  return results;
}

function getHighLowRange(rows: any) {
  let high = Number.MIN_SAFE_INTEGER;
  let low = Number.MAX_SAFE_INTEGER;
  rows.forEach((row: string) => {
    const splited = row.split(',')
    high = Math.max(high, +splited[ChartIndex.HIGH]);
    low = Math.min(low, +splited[ChartIndex.LOW]);
  });
  return {high: high, low: low};
}

export function stochasticOscillator(candles: any, timePeriod: number, kPeriod: number, dPeriod: number) {
  let n = candles.length;
  let results: { k: number | 'NaN', d: number | 'NaN', kperd: number | 'NaN' }[] = [];
  for (let i = 0; i < n; i++) {
    let currentCandle = candles[i];
    let close = +currentCandle.split(',')[ChartIndex.CLOSE];
    let highLowRange = getHighLowRange(candles.slice(Math.max(i - timePeriod + 1, 0), i + 1));
    let k = fixed(100 * (close - highLowRange.low) / (highLowRange.high - highLowRange.low));
    results.push({
      k: k,
      d: 'NaN',
      kperd: 'NaN',
    });
  }
  let k = movingAverage(results.map(x => x.k), kPeriod);
  let d = movingAverage(k, dPeriod);
  for (let i = 0; i < n; i++) {
    results[i].k = i >= kPeriod - 1 ? fixed(k[i - kPeriod + 1]) : 'NaN';
    results[i].d = i >= kPeriod + dPeriod - 2 ? fixed((d[i - kPeriod - dPeriod + 2])) : 'NaN';
    results[i].kperd = fixed(+results[i].k / +results[i].d)
  }
  return results;
}


export function bollingerBands(data: any, period: number) {
  const closePrices = data.map((d: any) => +d.split(',')[ChartIndex.CLOSE]);

  // Calculate the Simple Moving Average (SMA)
  const sma = [];
  for (let i = 0; i < closePrices.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum = fixed(sum + closePrices[i - j]);
    }
    sma.push(fixed(sum / period) ?? 'NaN');
  }

  // Calculate the standard deviation
  const deviations = [];
  for (let i = 0; i < closePrices.length; i++) {
    let deviationSum = 0;
    for (let j = 0; j < period; j++) {
      deviationSum = fixed(deviationSum + Math.pow(closePrices[i - j] - sma[i], 2));
    }
    deviations.push(Math.sqrt(fixed(deviationSum / period)));
  }

  // Calculate the upper and lower bands
  const upperBands = [];
  const lowerBands = [];
  for (let i = 0; i < closePrices.length; i++) {
    const close = +data[i].split(',')[ChartIndex.CLOSE]
    upperBands.push(fixed((close - (sma[i] + (2 * deviations[i]))) / (sma[i] + (2 * deviations[i])) * 100));
    lowerBands.push(fixed((close - (sma[i] - (2 * deviations[i]))) / (sma[i] - (2 * deviations[i])) * 100));
  }

  return {sma, upperBands, lowerBands};
}