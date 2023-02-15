import fs from 'fs';
import moment, {Moment} from "moment";
import {CandleTime, ChartIndex, DiffUnit} from "./types";
import {getDiff} from "./utils";
import {
  bollingerBands,
  calculateEMAAbs,
  calculateMACD, calculateMACDAbs,
  calculateRSI,
  calculateSMAAbs,
  calculateSMAVolume,
  changeAbs,
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

  const closeChangeArray = changeAbs(rows, ChartIndex.CLOSE)
  const volumeChangeArray = changeAbs(rows, ChartIndex.QUOTE_VOLUME)
  const ema5array = calculateEMAAbs(rows, 5, ChartIndex.CLOSE);
  const ema10array = calculateEMAAbs(rows, 10, ChartIndex.CLOSE);
  const ema20array = calculateEMAAbs(rows, 20, ChartIndex.CLOSE);
  const ema60array = calculateEMAAbs(rows, 60, ChartIndex.CLOSE);
  const ema120array = calculateEMAAbs(rows, 120, ChartIndex.CLOSE);
  const sma5array = calculateSMAAbs(rows, 5, ChartIndex.CLOSE);
  const sma10array = calculateSMAAbs(rows, 10, ChartIndex.CLOSE);
  const sma20array = calculateSMAAbs(rows, 20, ChartIndex.CLOSE);
  const sma60array = calculateSMAAbs(rows, 60, ChartIndex.CLOSE);
  const sma120array = calculateSMAAbs(rows, 120, ChartIndex.CLOSE);
  const {macdData, signalData, histogramData} = calculateMACDAbs(rows, 3, 10, 16);
  const rsi14array = calculateRSI(rows, 2);
  const stocahstic5array = stochasticOscillator(rows, 14, 5, 3);
  const bollinger10 = bollingerBands(rows, 20);
  const ema5VolumeArray = calculateEMAAbs(rows, 5, ChartIndex.QUOTE_VOLUME);
  const ema10VolumeArray = calculateEMAAbs(rows, 10, ChartIndex.QUOTE_VOLUME);
  const ema20VolumeArray = calculateEMAAbs(rows, 20, ChartIndex.QUOTE_VOLUME);
  const ema60VolumeArray = calculateEMAAbs(rows, 60, ChartIndex.QUOTE_VOLUME);
  const ema120VolumeArray = calculateEMAAbs(rows, 120, ChartIndex.QUOTE_VOLUME);
  const sma5VolumeArray = calculateSMAAbs(rows, 5, ChartIndex.QUOTE_VOLUME);
  const sma10VolumeArray = calculateSMAAbs(rows, 10, ChartIndex.QUOTE_VOLUME);
  const sma20VolumeArray = calculateSMAAbs(rows, 20, ChartIndex.QUOTE_VOLUME);
  const sma60VolumeArray = calculateSMAAbs(rows, 60, ChartIndex.QUOTE_VOLUME);
  const sma120VolumeArray = calculateSMAAbs(rows, 120, ChartIndex.QUOTE_VOLUME);

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

    rows[i] = rows[i] + ',' + closeChangeArray[i] + ',' + volumeChangeArray[i] + ',' + ema5 + ',' + ema10 + ',' + ema20 + ',' + ema60 + ',' + ema120 + ',' + sma5 + ',' + sma10 + ',' + sma20 + ',' + sma60 + ',' + sma120 + ',' + macdData[i] + ',' + signalData[i] + ',' + rsi14array[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i] + ',' + ema5Volume + ',' + ema10Volume + ',' + ema20Volume + ',' + ema60Volume + ',' + ema120Volume + ',' + sma5Volume + ',' + sma10Volume + ',' + sma20Volume + ',' + sma60Volume + ',' + sma120Volume

  }

  rows.forEach((v, i) => {
    // if (i < 120) {
    //     return;
    // }

    // if (i > 200) {
    //     return
    // }

    if (i < 200) {
      return;
    }

    if (i > 1640) {
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


const makeTextbookV2 = async (symbol: string, date: Moment) => {
  const csv = fs.readFileSync(`./datas/${symbol}/${symbol}-${date.format('YYYY')}-joinBook.csv`, 'utf-8')
  const rows = csv.split('\n')
  const length = rows.length;
  console.log("length", length)

  const closeChangeArray = changeAbs(rows, ChartIndex.CLOSE)
  const volumeChangeArray = changeAbs(rows, ChartIndex.QUOTE_VOLUME)
  const ema5array = calculateEMAAbs(rows, 5, ChartIndex.CLOSE);
  const ema10array = calculateEMAAbs(rows, 10, ChartIndex.CLOSE);
  const ema20array = calculateEMAAbs(rows, 20, ChartIndex.CLOSE);
  const ema60array = calculateEMAAbs(rows, 60, ChartIndex.CLOSE);
  const ema120array = calculateEMAAbs(rows, 120, ChartIndex.CLOSE);
  const sma5array = calculateSMAAbs(rows, 5, ChartIndex.CLOSE);
  const sma10array = calculateSMAAbs(rows, 10, ChartIndex.CLOSE);
  const sma20array = calculateSMAAbs(rows, 20, ChartIndex.CLOSE);
  const sma60array = calculateSMAAbs(rows, 60, ChartIndex.CLOSE);
  const sma120array = calculateSMAAbs(rows, 120, ChartIndex.CLOSE);
  const {macdData, signalData, histogramData} = calculateMACDAbs(rows, 5, 12, 24);
  const rsi14array = calculateRSI(rows, 14);
  const stocahstic5array = stochasticOscillator(rows, 14, 3, 3);
  const bollinger10 = bollingerBands(rows, 20);
  const ema5VolumeArray = calculateEMAAbs(rows, 5, ChartIndex.QUOTE_VOLUME);
  const ema10VolumeArray = calculateEMAAbs(rows, 10, ChartIndex.QUOTE_VOLUME);
  const ema20VolumeArray = calculateEMAAbs(rows, 20, ChartIndex.QUOTE_VOLUME);
  const ema60VolumeArray = calculateEMAAbs(rows, 60, ChartIndex.QUOTE_VOLUME);
  const ema120VolumeArray = calculateEMAAbs(rows, 120, ChartIndex.QUOTE_VOLUME);
  const sma5VolumeArray = calculateSMAAbs(rows, 5, ChartIndex.QUOTE_VOLUME);
  const sma10VolumeArray = calculateSMAAbs(rows, 10, ChartIndex.QUOTE_VOLUME);
  const sma20VolumeArray = calculateSMAAbs(rows, 20, ChartIndex.QUOTE_VOLUME);
  const sma60VolumeArray = calculateSMAAbs(rows, 60, ChartIndex.QUOTE_VOLUME);
  const sma120VolumeArray = calculateSMAAbs(rows, 120, ChartIndex.QUOTE_VOLUME);
  const ema5HighArray = calculateEMAAbs(rows, 5, ChartIndex.HIGH);
  const ema10HighArray = calculateEMAAbs(rows, 10, ChartIndex.HIGH);
  const ema20HighArray = calculateEMAAbs(rows, 20, ChartIndex.HIGH);
  const ema60HighArray = calculateEMAAbs(rows, 60, ChartIndex.HIGH);
  const ema120HighArray = calculateEMAAbs(rows, 120, ChartIndex.HIGH);
  const sma5HighArray = calculateSMAAbs(rows, 5, ChartIndex.HIGH);
  const sma10HighArray = calculateSMAAbs(rows, 10, ChartIndex.HIGH);
  const sma20HighArray = calculateSMAAbs(rows, 20, ChartIndex.HIGH);
  const sma60HighArray = calculateSMAAbs(rows, 60, ChartIndex.HIGH);
  const sma120HighArray = calculateSMAAbs(rows, 120, ChartIndex.HIGH);
  const ema5LowArray = calculateEMAAbs(rows, 5, ChartIndex.LOW);
  const ema10LowArray = calculateEMAAbs(rows, 10, ChartIndex.LOW);
  const ema20LowArray = calculateEMAAbs(rows, 20, ChartIndex.LOW);
  const ema60LowArray = calculateEMAAbs(rows, 60, ChartIndex.LOW);
  const ema120LowArray = calculateEMAAbs(rows, 120, ChartIndex.LOW);
  const sma5LowArray = calculateSMAAbs(rows, 5, ChartIndex.LOW);
  const sma10LowArray = calculateSMAAbs(rows, 10, ChartIndex.LOW);
  const sma20LowArray = calculateSMAAbs(rows, 20, ChartIndex.LOW);
  const sma60LowArray = calculateSMAAbs(rows, 60, ChartIndex.LOW);
  const sma120LowArray = calculateSMAAbs(rows, 120, ChartIndex.LOW);
  const highChangeArray = changeAbs(rows, ChartIndex.HIGH)
  const lowChangeArray = changeAbs(rows, ChartIndex.LOW)

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
    const ema5High = i < 4 ? 'NaN' : ema5HighArray[i - 4]
    const ema10High = i < 9 ? 'NaN' : ema10HighArray[i - 9]
    const ema20High = i < 19 ? 'NaN' : ema20HighArray[i - 19]
    const ema60High = i < 59 ? 'NaN' : ema60HighArray[i - 59]
    const ema120High = i < 119 ? 'NaN' : ema120HighArray[i - 119]
    const sma5High = i < 4 ? 'NaN' : sma5HighArray[i - 4]
    const sma10High = i < 9 ? 'NaN' : sma10HighArray[i - 9]
    const sma20High = i < 19 ? 'NaN' : sma20HighArray[i - 19]
    const sma60High = i < 59 ? 'NaN' : sma60HighArray[i - 59]
    const sma120High = i < 119 ? 'NaN' : sma120HighArray[i - 119]
    const ema5Low = i < 4 ? 'NaN' : ema5LowArray[i - 4]
    const ema10Low = i < 9 ? 'NaN' : ema10LowArray[i - 9]
    const ema20Low = i < 19 ? 'NaN' : ema20LowArray[i - 19]
    const ema60Low = i < 59 ? 'NaN' : ema60LowArray[i - 59]
    const ema120Low = i < 119 ? 'NaN' : ema120LowArray[i - 119]
    const sma5Low = i < 4 ? 'NaN' : sma5LowArray[i - 4]
    const sma10Low = i < 9 ? 'NaN' : sma10LowArray[i - 9]
    const sma20Low = i < 19 ? 'NaN' : sma20LowArray[i - 19]
    const sma60Low = i < 59 ? 'NaN' : sma60LowArray[i - 59]
    const sma120Low = i < 119 ? 'NaN' : sma120LowArray[i - 119]

    rows[i] = rows[i] + ',' + closeChangeArray[i] + ',' + volumeChangeArray[i] + ',' + ema5 + ',' + ema10 + ',' + ema20 + ',' + ema60 + ',' + ema120 + ',' + sma5 + ',' + sma10 + ',' + sma20 + ',' + sma60 + ',' + sma120 + ',' + macdData[i] + ',' + signalData[i] + ',' + rsi14array[i] + ',' + stocahstic5array[i].k + ',' + stocahstic5array[i].d + ',' + bollinger10.upperBands[i] + ',' + bollinger10.lowerBands[i] + ',' + ema5Volume + ',' + ema10Volume + ',' + ema20Volume + ',' + ema60Volume + ',' + ema120Volume + ',' + sma5Volume + ',' + sma10Volume + ',' + sma20Volume + ',' + sma60Volume + ',' + sma120Volume + ',' + ema5High + ',' + ema10High + ',' + ema20High + ',' + ema60High + ',' + ema120High + ',' + sma5High + ',' + sma10High + ',' + sma20High + ',' + sma60High + ',' + sma120High + ',' + ema5Low + ',' + ema10Low + ',' + ema20Low + ',' + ema60Low + ',' + ema120Low + ',' + sma5Low + ',' + sma10Low + ',' + sma20Low + ',' + sma60Low + ',' + sma120Low + ',' + highChangeArray[i] + ',' + lowChangeArray[i]

  }

  rows.forEach((v, i) => {
    // if (i < 120) {
    //     return;
    // }

    // if (i > 200) {
    //     return
    // }

    if (i < 200) {
      return;
    }

    if (i > 1640) {
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

joinAndMake('1000LUNCUSDT', '5m', moment('2022-09-09'), moment('2022-12-31'));


