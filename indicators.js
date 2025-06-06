"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bollingerBands = exports.stochasticOscillator = exports.calculateRSI = exports.calculateMACDAbs = exports.calculateMACD = exports.calculateSMAAbs = exports.calculateSMA = exports.calculateSMAVolume = exports.calculateEMAAbs = exports.calculateEMA = exports.calculateEMAVolume = exports.changeAbs = exports.changePercent = exports.fixed = void 0;
const types_1 = require("./types");
function fixed(num, to = 10) {
    if (typeof num === 'string') {
        return Number(Number(num).toFixed(to));
    }
    return Number(num.toFixed(to));
}
exports.fixed = fixed;
function changePercent(rows, index) {
    const changes = [];
    for (let i = 0; i < rows.length; i++) {
        if (i === 0) {
            changes.push('NaN');
            continue;
        }
        const prevClose = +rows[i - 1].split(',')[index];
        const currClose = +rows[i].split(',')[index];
        changes.push(fixed((currClose - prevClose) / prevClose * 100));
    }
    return changes;
}
exports.changePercent = changePercent;
function changeAbs(rows, index) {
    const changes = [];
    for (let i = 0; i < rows.length; i++) {
        if (i === 0) {
            changes.push('NaN');
            continue;
        }
        const prevClose = +rows[i - 1].split(',')[index];
        const currClose = +rows[i].split(',')[index];
        changes.push(fixed((currClose - prevClose)));
    }
    return changes;
}
exports.changeAbs = changeAbs;
function calculateEMAVolume(rows, period) {
    const emaArray = [];
    // Calculate the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        // close
        const row = rows[i].split(',');
        sum = Number((sum + +row[types_1.ChartIndex.VOLUME]).toFixed(10));
    }
    const firstEMA = Number((sum / period).toFixed(10));
    emaArray.push(firstEMA);
    // Calculate the weighting multiplier
    const multiplier = Number((2 / (period + 1)).toFixed(10));
    // Calculate the subsequent EMAs
    for (let i = period; i < rows.length; i++) {
        const row = rows[i].split(',');
        const close = +row[types_1.ChartIndex.VOLUME];
        const currentEMA = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
        emaArray.push(currentEMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const volume = +rows[i].split(',')[types_1.ChartIndex.VOLUME];
        emaArray[i] = fixed((volume - emaArray[i]) / emaArray[i] * 100);
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
        sum = Number((sum + +row[types_1.ChartIndex.CLOSE]).toFixed(10));
    }
    const firstEMA = Number((sum / period).toFixed(10));
    emaArray.push(firstEMA);
    // Calculate the weighting multiplier
    const multiplier = Number((2 / (period + 1)).toFixed(10));
    // Calculate the subsequent EMAs
    for (let i = period; i < rows.length; i++) {
        const row = rows[i].split(',');
        const close = +row[types_1.ChartIndex.CLOSE];
        const currentEMA = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
        emaArray.push(currentEMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[types_1.ChartIndex.CLOSE];
        emaArray[i] = fixed((close - emaArray[i]) / emaArray[i] * 100);
    }
    return emaArray;
}
exports.calculateEMA = calculateEMA;
function calculateEMAAbs(rows, period, index) {
    const emaArray = [];
    // Calculate the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        // close
        const row = rows[i].split(',');
        sum = Number((sum + +row[index]).toFixed(10));
    }
    const firstEMA = Number((sum / period).toFixed(10));
    emaArray.push(firstEMA);
    // Calculate the weighting multiplier
    const multiplier = Number((2 / (period + 1)).toFixed(10));
    // Calculate the subsequent EMAs
    for (let i = period; i < rows.length; i++) {
        const row = rows[i].split(',');
        const close = +row[index];
        const currentEMA = Number(((close - emaArray[i - period]) * multiplier + emaArray[i - period]).toFixed(10));
        emaArray.push(currentEMA);
    }
    return emaArray;
}
exports.calculateEMAAbs = calculateEMAAbs;
function calculateSMAVolume(rows, period) {
    const smaArray = [];
    // Calculate the first SMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        const row = rows[i].split(',');
        sum = Number((sum + +row[types_1.ChartIndex.VOLUME]).toFixed(10));
    }
    const firstSMA = sum / period;
    smaArray.push(firstSMA);
    // Calculate the subsequent SMAs
    for (let i = period; i < rows.length; i++) {
        const pastVolume = rows[i - period].split(',')[types_1.ChartIndex.VOLUME];
        const currVolume = rows[i].split(',')[types_1.ChartIndex.VOLUME];
        sum = Number((sum - +pastVolume + +currVolume).toFixed(10));
        const currentSMA = Number((sum / period).toFixed(10));
        smaArray.push(fixed(currentSMA));
    }
    for (let i = 0; i < rows.length; i++) {
        const volume = +rows[i].split(',')[types_1.ChartIndex.VOLUME];
        smaArray[i] = fixed((volume - smaArray[i]) / smaArray[i] * 100);
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
        sum = Number((sum + +row[types_1.ChartIndex.CLOSE]).toFixed(10));
    }
    const firstSMA = sum / period;
    smaArray.push(firstSMA);
    // Calculate the subsequent SMAs
    for (let i = period; i < rows.length; i++) {
        const pastClose = rows[i - period].split(',')[types_1.ChartIndex.CLOSE];
        const currClose = rows[i].split(',')[types_1.ChartIndex.CLOSE];
        sum = Number((sum - +pastClose + +currClose).toFixed(10));
        const currentSMA = Number((sum / period).toFixed(10));
        smaArray.push(currentSMA);
    }
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[types_1.ChartIndex.CLOSE];
        smaArray[i] = fixed((close - smaArray[i]) / smaArray[i] * 100);
    }
    return smaArray;
}
exports.calculateSMA = calculateSMA;
function calculateSMAAbs(rows, period, index) {
    const smaArray = [];
    // Calculate the first SMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        const row = rows[i].split(',');
        sum = Number((sum + +row[index]).toFixed(10));
    }
    const firstSMA = sum / period;
    smaArray.push(firstSMA);
    // Calculate the subsequent SMAs
    for (let i = period; i < rows.length; i++) {
        const pastClose = rows[i - period].split(',')[index];
        const currClose = rows[i].split(',')[index];
        sum = Number((sum - +pastClose + +currClose).toFixed(10));
        const currentSMA = Number((sum / period).toFixed(10));
        smaArray.push(currentSMA);
    }
    return smaArray;
}
exports.calculateSMAAbs = calculateSMAAbs;
function calculateMACD(rows, fast, slow) {
    const macdData = [];
    const signalData = [];
    const histogramData = [];
    let ema12 = 0;
    let ema26 = 0;
    let signal = 0;
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[types_1.ChartIndex.CLOSE];
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
            signalData.push('NaN');
            histogramData.push('NaN');
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
function calculateMACDAbs(rows, fast, slow) {
    const macdData = [];
    const signalData = [];
    const histogramData = [];
    let ema12 = 0;
    let ema26 = 0;
    let signal = 0;
    for (let i = 0; i < rows.length; i++) {
        const close = +rows[i].split(',')[types_1.ChartIndex.CLOSE];
        if (i === 0) {
            ema12 = close;
            ema26 = close;
        }
        else {
            ema12 = Number(((close * (2 / (fast + 1))) + (ema12 * (1 - (2 / (fast + 1))))).toFixed(10));
            ema26 = Number(((close * (2 / (slow + 1))) + (ema26 * (1 - (2 / (slow + 1))))).toFixed(10));
        }
        const macd = Number((ema12 - ema26).toFixed(10));
        macdData.push(macd);
        if (i < 8) {
            signalData.push('NaN');
            histogramData.push('NaN');
        }
        else {
            if (i === 8) {
                signal = macd;
            }
            else {
                signal = fixed((macd * (2 / (9 + 1))) + (signal * (1 - (2 / (9 + 1)))));
            }
            signalData.push(signal);
            histogramData.push(Number((macd - signal).toFixed(10)));
        }
    }
    return {
        macdData,
        signalData,
        histogramData
    };
}
exports.calculateMACDAbs = calculateMACDAbs;
function calculateRSI(rows, period) {
    let gains = [];
    let losses = [];
    let avgGain, avgLoss, rsiArray = [];
    for (let i = 0; i < rows.length; i++) {
        let currentCandle = rows[i];
        let previousCandle = rows[i - 1];
        if (previousCandle) {
            const change = fixed(+currentCandle.split(',')[types_1.ChartIndex.CLOSE] - +previousCandle.split(',')[types_1.ChartIndex.CLOSE]);
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
            rsiArray.push('NaN');
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
        high = Math.max(high, +splited[types_1.ChartIndex.HIGH]);
        low = Math.min(low, +splited[types_1.ChartIndex.LOW]);
    });
    return { high: high, low: low };
}
function stochasticOscillator(candles, timePeriod, kPeriod, dPeriod) {
    let n = candles.length;
    let results = [];
    for (let i = 0; i < n; i++) {
        let currentCandle = candles[i];
        let close = +currentCandle.split(',')[types_1.ChartIndex.CLOSE];
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
        results[i].kperd = fixed(+results[i].k / +results[i].d);
    }
    return results;
}
exports.stochasticOscillator = stochasticOscillator;
function bollingerBands(data, period) {
    var _a;
    const closePrices = data.map((d) => +d.split(',')[types_1.ChartIndex.CLOSE]);
    // Calculate the Simple Moving Average (SMA)
    const sma = [];
    for (let i = 0; i < closePrices.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum = fixed(sum + closePrices[i - j]);
        }
        sma.push((_a = fixed(sum / period)) !== null && _a !== void 0 ? _a : 'NaN');
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
        const close = +data[i].split(',')[types_1.ChartIndex.CLOSE];
        upperBands.push(fixed((close - (sma[i] + (2 * deviations[i]))) / (sma[i] + (2 * deviations[i])) * 100));
        lowerBands.push(fixed((close - (sma[i] - (2 * deviations[i]))) / (sma[i] - (2 * deviations[i])) * 100));
    }
    return { sma, upperBands, lowerBands };
}
exports.bollingerBands = bollingerBands;
