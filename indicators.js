"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bollingerBands = exports.stochasticOscillator = exports.calculateRSI = exports.calculateMACD = exports.calculateSMA = exports.calculateSMAVolume = exports.calculateEMA = exports.calculateEMAVolume = exports.fixed = void 0;
function fixed(num, to = 10) {
    if (typeof num === 'string') {
        return Number(Number(num).toFixed(to));
    }
    return Number(num.toFixed(to));
}
exports.fixed = fixed;
function calculateEMAVolume(rows, period) {
    const emaArray = [];
    // Calculate the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        // close
        const row = rows[i].split(',');
        sum = Number((sum + +row[5]).toFixed(10));
    }
    const firstEMA = Number((sum / period).toFixed(10));
    emaArray.push(firstEMA);
    // Calculate the weighting multiplier
    const multiplier = Number((2 / (period + 1)).toFixed(10));
    // Calculate the subsequent EMAs
    for (let i = period; i < rows.length; i++) {
        const row = rows[i].split(',');
        const close = +row[5];
        const currentEMA = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
        emaArray.push(currentEMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const volume = +rows[i].split(',')[5];
        emaArray[i] = fixed(volume / emaArray[i]);
    }
    return emaArray;
}
exports.calculateEMAVolume = calculateEMAVolume;
function calculateEMA(rows, period) {
    const emaArray = [];
    // Calculate the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        // close
        const row = rows[i].split(',');
        sum = Number((sum + +row[4]).toFixed(10));
    }
    const firstEMA = Number((sum / period).toFixed(10));
    emaArray.push(firstEMA);
    // Calculate the weighting multiplier
    const multiplier = Number((2 / (period + 1)).toFixed(10));
    // Calculate the subsequent EMAs
    for (let i = period; i < rows.length; i++) {
        const row = rows[i].split(',');
        const close = +row[4];
        const currentEMA = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
        emaArray.push(currentEMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[4];
        emaArray[i] = fixed(close / emaArray[i]);
    }
    return emaArray;
}
exports.calculateEMA = calculateEMA;
function calculateSMAVolume(rows, period) {
    const smaArray = [];
    // Calculate the first SMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        const row = rows[i].split(',');
        sum = Number((sum + +row[5]).toFixed(10));
    }
    const firstSMA = sum / period;
    smaArray.push(firstSMA);
    // Calculate the subsequent SMAs
    for (let i = period; i < rows.length; i++) {
        const pastVolume = rows[i - period].split(',')[5];
        const currVolume = rows[i].split(',')[5];
        sum = Number((sum - +pastVolume + +currVolume).toFixed(10));
        const currentSMA = Number((sum / period).toFixed(10));
        smaArray.push(fixed(currentSMA));
    }
    for (let i = 0; i < rows.length; i++) {
        const volume = +rows[i].split(',')[5];
        smaArray[i] = fixed(volume / smaArray[i]);
    }
    return smaArray;
}
exports.calculateSMAVolume = calculateSMAVolume;
function calculateSMA(rows, period) {
    const smaArray = [];
    // Calculate the first SMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        const row = rows[i].split(',');
        sum = Number((sum + +row[4]).toFixed(10));
    }
    const firstSMA = sum / period;
    smaArray.push(firstSMA);
    // Calculate the subsequent SMAs
    for (let i = period; i < rows.length; i++) {
        const pastClose = rows[i - period].split(',')[4];
        const currClose = rows[i].split(',')[4];
        sum = Number((sum - +pastClose + +currClose).toFixed(10));
        const currentSMA = Number((sum / period).toFixed(10));
        smaArray.push(currentSMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[4];
        smaArray[i] = fixed(close / smaArray[i]);
    }
    return smaArray;
}
exports.calculateSMA = calculateSMA;
function calculateMACD(rows, fast, slow) {
    const macdData = [];
    const signalData = [];
    const histogramData = [];
    let ema12 = 0;
    let ema26 = 0;
    let signal = 0;
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[4];
        if (i === 0) {
            ema12 = close;
            ema26 = close;
        }
        else {
            ema12 = Number(((close * (2 / (fast + 1))) + (ema12 * (1 - (2 / (fast + 1))))).toFixed(10));
            ema26 = Number(((close * (2 / (slow + 1))) + (ema26 * (1 - (2 / (slow + 1))))).toFixed(10));
        }
        const macd = Number((ema12 - ema26).toFixed(10));
        macdData.push(fixed(macd / close * 100));
        if (i < 8) {
            signalData.push('null');
            histogramData.push('null');
        }
        else {
            if (i === 8) {
                signal = macd;
            }
            else {
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
exports.calculateMACD = calculateMACD;
function calculateRSI(rows, period) {
    let gains = [];
    let losses = [];
    let avgGain, avgLoss, rsiArray = [];
    for (let i = 0; i < rows.length; i++) {
        let currentCandle = rows[i];
        let previousCandle = rows[i - 1];
        if (previousCandle) {
            const change = fixed(+currentCandle.split(',')[4] - +previousCandle.split(',')[4]);
            if (change > 0) {
                gains.push(change);
            }
            else if (change < 0) {
                losses.push(-change);
            }
        }
        if (i >= period) {
            avgGain = fixed(gains.slice(-period).reduce((sum, value) => sum + value, 0) / period);
            avgLoss = fixed(losses.slice(-period).reduce((sum, value) => sum + value, 0) / period);
            const rsi = fixed(100 - (100 / (1 + (avgGain / avgLoss))));
            rsiArray.push(rsi);
        }
        else {
            rsiArray.push('null');
        }
    }
    return rsiArray;
}
exports.calculateRSI = calculateRSI;
function movingAverage(values, period) {
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
function getHighLowRange(rows) {
    let high = Number.MIN_SAFE_INTEGER;
    let low = Number.MAX_SAFE_INTEGER;
    rows.forEach((row) => {
        const splited = row.split(',');
        high = Math.max(high, +splited[2]);
        low = Math.min(low, +splited[3]);
    });
    return { high: high, low: low };
}
function stochasticOscillator(candles, timePeriod, kPeriod, dPeriod) {
    let n = candles.length;
    let results = [];
    for (let i = 0; i < n; i++) {
        let currentCandle = candles[i];
        let close = +currentCandle.split(',')[4];
        let highLowRange = getHighLowRange(candles.slice(Math.max(i - timePeriod + 1, 0), i + 1));
        let k = fixed(100 * (close - highLowRange.low) / (highLowRange.high - highLowRange.low));
        results.push({
            k: k,
            d: 'null',
            kperd: 'null',
        });
    }
    let k = movingAverage(results.map(x => x.k), kPeriod);
    let d = movingAverage(k, dPeriod);
    for (let i = 0; i < n; i++) {
        const close = +candles[i].split(',')[4];
        results[i].k = i >= kPeriod - 1 ? fixed(k[i - kPeriod + 1]) : 'null';
        results[i].d = i >= kPeriod + dPeriod - 2 ? fixed((d[i - kPeriod - dPeriod + 2])) : 'null';
        results[i].kperd = fixed(+results[i].k / +results[i].d);
    }
    return results;
}
exports.stochasticOscillator = stochasticOscillator;
function bollingerBands(data, period) {
    var _a;
    const closePrices = data.map((d) => +d.split(',')[4]);
    // Calculate the Simple Moving Average (SMA)
    const sma = [];
    for (let i = 0; i < closePrices.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum = fixed(sum + closePrices[i - j]);
        }
        sma.push((_a = fixed(sum / period)) !== null && _a !== void 0 ? _a : 'null');
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
        const close = +data[i].split(',')[4];
        upperBands.push(fixed((sma[i] + (2 * deviations[i])) / close));
        lowerBands.push(fixed((sma[i] - (2 * deviations[i])) / close));
    }
    return { sma, upperBands, lowerBands };
}
exports.bollingerBands = bollingerBands;
