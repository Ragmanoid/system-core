import config from 'config'
import got from 'got'

export default async (response: string) => {
    try {
        const secret = config.get('secretCaptchaToken')
        const result: any = await got(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`).json()
        return result.success || false
    } catch (error) {
        console.error(error.response.body)
        return false
    }
}