import { createClient } from 'redis'

export const redis = createClient()

let retryCount = 10;

redis.on('error', err => {
    retryCount--;
    if (retryCount !== 0)
    {
        console.log('retry ' + retryCount)
        setTimeout(() => {
            redis.connect()
        }, 1000)
        return
    }
    console.error('[!] Redis Client Error', err)
    process.exit(1)
})

redis.on('ready', () => console.log('[*] Redis Client Ready'))
redis.connect()