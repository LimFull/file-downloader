import fs from 'fs';
import moment, {Moment} from "moment";
import {CandleTime, DiffUnit} from "./types";
import {getDiff} from "./utils";
import {
    bollingerBands,
    calculateEMA, calculateEMAVolume,
    calculateMACD,
    calculateRSI,
    calculateSMA, calculateSMAVolume,
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

    const ema5array = calculateEMA(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema5array[i - 4]
        }
    }

    const ema10array = calculateEMA(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema10array[i - 9]
        }
    }

    const ema20array = calculateEMA(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema20array[i - 19]
        }
    }

    const ema60array = calculateEMA(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema60array[i - 59]
        }
    }

    const ema120array = calculateEMA(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema120array[i - 119]
        }
    }

    const sma5array = calculateSMA(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma5array[i - 4]
        }
    }

    const sma10array = calculateSMA(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma10array[i - 9]
        }
    }

    const sma20array = calculateSMA(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma20array[i - 9]
        }
    }

    const sma60array = calculateSMA(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma60array[i - 9]
        }
    }

    const sma120array = calculateSMA(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma120array[i - 9]
        }
    }

    const {macdData, signalData, histogramData} = calculateMACD(rows, 5, 12);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + macdData[i] + ',' + signalData[i]
    }

    const rsi14array = calculateRSI(rows, 5);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + rsi14array[i]
    }

    const stocahstic5array = stochasticOscillator(rows, 5, 5, 5);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + stocahstic5array[i].kperd
    }

    const bollinger10 = bollingerBands(rows, 10);
    for (let i = 0; i < length; i++) {
        rows[i] = rows[i] + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i]
    }

    const ema5VolumeArray = calculateEMAVolume(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema5VolumeArray[i - 4]
        }
    }

    const ema10VolumeArray = calculateEMAVolume(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema10VolumeArray[i - 9]
        }
    }

    const ema20VolumeArray = calculateEMAVolume(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema20VolumeArray[i - 19]
        }
    }

    const ema60VolumeArray = calculateEMAVolume(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema60VolumeArray[i - 59]
        }
    }

    const ema120VolumeArray = calculateEMAVolume(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + ema120VolumeArray[i - 119]
        }
    }


    const sma5VolumeArray = calculateSMAVolume(rows, 5);
    for (let i = 0; i < length; i++) {
        if (i < 4) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma5VolumeArray[i - 4]
        }
    }

    const sma10VolumeArray = calculateSMAVolume(rows, 10);
    for (let i = 0; i < length; i++) {
        if (i < 9) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma10VolumeArray[i - 9]
        }
    }

    const sma20VolumeArray = calculateSMAVolume(rows, 20);
    for (let i = 0; i < length; i++) {
        if (i < 19) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma20VolumeArray[i - 9]
        }
    }

    const sma60VolumeArray = calculateSMAVolume(rows, 60);
    for (let i = 0; i < length; i++) {
        if (i < 59) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma60VolumeArray[i - 9]
        }
    }

    const sma120VolumeArray = calculateSMAVolume(rows, 120);
    for (let i = 0; i < length; i++) {
        if (i < 119) {
            rows[i] = rows[i] + ',' + 'null'
        } else {
            rows[i] = rows[i] + "," + sma120VolumeArray[i - 9]
        }
    }

    rows.forEach((v, i) => {
        // if (i < 120) {
        //     return;
        // }

        if (i === rows.length - 1) {
            fs.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v.toString())
        } else {
            fs.appendFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-textBook.csv`, v + '\n')
        }
    })

    return;
}


async function joinAndMake() {
    // await joinBook('1000LUNCUSDT', '1m', moment('2022-09-09'), moment('2022-12-31'))
    await makeTextbook('1000LUNCUSDT', moment('2022'))
}

joinAndMake();


