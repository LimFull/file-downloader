import fs from 'fs';
import https from 'https';
import {CandleTime, DiffUnit} from "./types";
import {getDiff} from "./utils";
import moment, {Moment} from "moment";
import decompress from "decompress";

const SYMBOL = '1000LUNCUSDT';
const TIME = '1m';
const START_DATE = '2022-09-09'
const END_DATE = '2022-12-31'


const getNames = (symbol: string, time: CandleTime, date: Moment) => {
  const yyyyMMdd = date.format('YYYY-MM-DD')
  const path = `https://data.binance.vision/data/futures/um/daily/klines/${symbol}/${time}/${symbol}-${time}-${yyyyMMdd}.zip`
  const fileName = `./datas/${symbol}/${symbol}_${time}_${yyyyMMdd}.zip`
  return {path, fileName}
}

const download = async (symbol: string, time: CandleTime, date: Moment): Promise<void> => {
  const dir = `./datas/${symbol}`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const {path, fileName} = getNames(symbol, time, date)

  return new Promise<void>(resolve => {
    const file = fs.createWriteStream(fileName);
    https.get(path, (result) => {
      result.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log("Download Completed for", symbol, time, date)
        resolve()
      })
    })
  }).then(() => {
    return decompress(fileName, dir)
  }).then(() => {
    fs.rmSync(fileName)
  })
}

const downloadAll = async (symbol: string, time: CandleTime, start: string, end: string, unit: DiffUnit) => {
  const diff: number = getDiff(start, end, unit);
  let cursor = moment(start);
  for (let i = 0; i <= diff; i++) {
    await download(symbol, time, cursor)
    cursor = cursor.add(1, unit)
  }
  console.log("Download All Completed")
}

// downloadAll(SYMBOL, TIME, START_DATE, END_DATE, DiffUnit.DAY)
