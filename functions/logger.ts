import config from 'config'
import pino from 'pino'
import moment from 'moment'

export const createLogger = (filename: string) => {
    const path = filename.split(/[\\/]/)
    const name = `${path[path.length - 2]}_${path[path.length - 1].split('.')[0]}`

    const date = moment(new Date())
    const formattedDate = date.format('YYYY_MM_DD')
    const destination = pino.destination(`${config.get('logPath')}/${formattedDate}_${name}_log.txt`)

    return pino({
        name
    }, destination)
}