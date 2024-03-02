import fs from 'fs'
import config from "config";
import path from "path";
import moment from "moment/moment";

export const cleanLogs = () => {
    const logPath: string = config.get('logPath')
    const logs = fs.readdirSync(logPath)
    for (let logName of logs) {
        const date = moment(new Date())
        const formattedDate = date.format('YYYY_MM_DD')
        if (logName.startsWith(formattedDate))
            continue

        const log = path.join(logPath, logName)
        const data = fs.readFileSync(log, { encoding: 'utf-8', flag: 'r' });

        if (data.length === 0) {
            fs.unlinkSync(log)
            console.log(log)
        }
    }
}