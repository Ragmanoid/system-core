import { createClient } from 'redis'

export const redis = createClient({
    url: process.env.REDIS_URL || 'localhost',
})

redis.on('error', err => {
    console.error('[!] Redis Client Error', err, err.name)
    process.exit(1)
})

redis.on('ready', () => console.log('[*] Redis Client Ready'))
redis.connect()