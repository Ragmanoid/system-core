import mongoose from 'mongoose'
import config from 'config'

mongoose.set('strictQuery', false)

const connectMongoose = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'),)
    } catch (e) {
        console.error('[!] Mongo connect error', e)
        process.exit(1)
    }
}

connectMongoose()