import fs from 'fs';
import moment, {Moment} from "moment";
import {CandleTime, ChartIndex, DiffUnit} from "./types";
import {getDiff} from "./utils";
import {
    bollingerBands,
    calculateEMA,
    calculateEMAVolume,
    calculateMACD,
    calculateRSI,
    calculateSMA,
    calculateSMAVolume,
    changePercent,
    stochasticOscillator
} from "./indicators";


// open_time, open, high, low, close, volume, close_time, quote_volume, count, taker_buy_volume, taker_buy_quote_volume, ignore
const joinBook = async (symbol: string, time: CandleTime, start: Moment, end: Moment) => {
    const diff: number = getDiff(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), DiffUnit.DAY);
    let cursor = moment(start);
    for (let i = 0; i < diff + 1; i++) {
        const csv = fs.readFileSync(`./datas/${symbol}/${symbol}-${time}-${cursor.format('YYYY-MM-DD')}.csv`, 'utf-8')
        const rows = csv.split('\n')
        const textbook: any[] = [];
        if (rows[0].includes('open_time')) {
            rows.shift()
        }
        if (rows[rows.length - 1] === '') {
            rows.pop();
        }
        for (const i in rows) {
            const row = rows[i];
            textbook.push(row.split(','))
        }

        textbook.forEach((v, j) => {
            if (j === textbook.length - 1 && i === diff) {
                fs.appendFileSync(`./datas/${symbol}/${symbol}-${cursor.format('YYYY')}-joinBook.csv`, v.toString())
            } else {
                fs.appendFileSync(`./datas/${symbol}/${symbol}-${cursor.format('YYYY')}-joinBook.csv`, v + '\n')
            }
        })
        console.log("write", cursor.format('YYYY-MM-DD'))
        cursor = cursor.add(1, DiffUnit.DAY)
    }
    return;
}

const makeTextbook = async (symbol: string, date: Moment) => {
    const csv = fs.readFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-joinBook.csv`, 'utf-8')
    const rows = csv.split('\n')
    const length = rows.length;
    console.log("length", length)

    const closeChangeArray = changePercent(rows, ChartIndex.CLOSE)
    const volumeChangeArray = changePercent(rows, ChartIndex.VOLUME)
    const ema5array = calculateEMA(rows, 5);
    const ema10array = calculateEMA(rows, 10);
    const ema20array = calculateEMA(rows, 20);
    const ema60array = calculateEMA(rows, 60);
    const ema120array = calculateEMA(rows, 120);
    const sma5array = calculateSMA(rows, 5);
    const sma10array = calculateSMA(rows, 10);
    const sma20array = calculateSMA(rows, 20);
    const sma60array = calculateSMA(rows, 60);
    const sma120array = calculateSMA(rows, 120);
    const {macdData, signalData, histogramData} = calculateMACD(rows, 5, 12);
    const rsi14array = calculateRSI(rows, 5);
    const stocahstic5array = stochasticOscillator(rows, 5, 5, 5);
    const bollinger10 = bollingerBands(rows, 10);
    const ema5VolumeArray = calculateEMAVolume(rows, 5);
    const ema10VolumeArray = calculateEMAVolume(rows, 10);
    const ema20VolumeArray = calculateEMAVolume(rows, 20);
    const ema60VolumeArray = calculateEMAVolume(rows, 60);
    const ema120VolumeArray = calculateEMAVolume(rows, 120);
    const sma5VolumeArray = calculateSMAVolume(rows, 5);
    const sma10VolumeArray = calculateSMAVolume(rows, 10);
    const sma20VolumeArray = calculateSMAVolume(rows, 20);
    const sma60VolumeArray = calculateSMAVolume(rows, 60);
    const sma120VolumeArray = calculateSMAVolume(rows, 120);

    for (let i = 0; i < length; i++) {
        const ema5 = i < 4 ? 'NaN' : ema5array[i - 4]
        const ema10 = i < 9 ? 'NaN' : ema10array[i - 9]
        const ema20 = i < 19 ? 'NaN' : ema20array[i - 19]
        const ema60 = i < 59 ? 'NaN' : ema60array[i - 59]
        const ema120 = i < 119 ? 'NaN' : ema120array[i - 119]
        const sma5 = i < 4 ? 'NaN' : sma5array[i - 4]
        const sma10 = i < 9 ? 'NaN' : sma10array[i - 9]
        const sma20 = i < 19 ? 'NaN' : sma20array[i - 19]
        const sma60 = i < 59 ? 'NaN' : sma60array[i - 59]
        const sma120 = i < 119 ? 'NaN' : sma120array[i - 119]
        const ema5Volume = i < 4 ? 'NaN' : ema5VolumeArray[i - 4]
        const ema10Volume = i < 9 ? 'NaN' : ema10VolumeArray[i - 9]
        const ema20Volume = i < 19 ? 'NaN' : ema20VolumeArray[i - 19]
        const ema60Volume = i < 59 ? 'NaN' : ema60VolumeArray[i - 59]
        const ema120Volume = i < 119 ? 'NaN' : ema120VolumeArray[i - 119]
        const sma5Volume = i < 4 ? 'NaN' : sma5VolumeArray[i - 4]
        const sma10Volume = i < 9 ? 'NaN' : sma10VolumeArray[i - 9]
        const sma20Volume = i < 19 ? 'NaN' : sma20VolumeArray[i - 19]
        const sma60Volume = i < 59 ? 'NaN' : sma60VolumeArray[i - 59]
        const sma120Volume = i < 119 ? 'NaN' : sma120VolumeArray[i - 119]

        rows[i] = rows[i] + ',' + closeChangeArray[i] + ',' + volumeChangeArray[i] + ',' + ema5 + ',' + ema10 + ',' + ema20 + ',' + ema60 + ',' + ema120 + ',' + sma5 + ',' + sma10 + ',' + sma20 + ',' + sma60 + ',' + sma120 + ',' + macdData[i] + ',' + signalData[i] + ',' + rsi14array[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + stocahstic5array[i].kperd + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i] + ',' + ema5Volume + ',' + ema10Volume + ',' + ema20Volume + ',' + ema60Volume + ',' + ema120Volume + ',' + sma5Volume + ',' + sma10Volume + ',' + sma20Volume + ',' + sma60Volume + ',' + sma120Volume

    }

    rows.forEach((v, i) => {
        // if (i < 120) {
        //     return;
        // }

        // if (i > 200) {
        //     return
        // }

        // if (i < 200) {
        //     return;
        // }
        //
        // if (i > 1860) {
        //     return
        // }

        if (i < 1860) {
            return;
        }

        if (i > 3000) {
            return
        }

        if (i === rows.length - 1) {
            fs.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v.toString())
        } else {
            fs.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v + '\n')
        }
    })

    return;
}


async function joinAndMake(symbol: string, time: CandleTime, start: Moment, end: Moment) {
    // await joinBook(symbol, time, start, end)
    await makeTextbook(symbol, moment('2022'))
}

joinAndMake('1000LUNCUSDT', '1m', moment('2022-09-09'), moment('2022-12-31'));


