import { NextFunction, Request, Response } from "express";

const getMessageFromErr = (endCode: number, err: Error) => {
    return err.message.substring(endCode + 1, err.message.length).trim()
}

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    let resultStatusCode = 500
    let resultMessage = 'Неизвестная ошибка'

    if (err.message.startsWith('[')) {
        const endCode = err.message.indexOf(']')
        const code = err.message.substring(1, endCode)
        const message = getMessageFromErr(endCode, err)

        switch (code) {
            case '403':
                [resultStatusCode, resultMessage] = [403, message || 'Нет доступа']
                break

            case '401':
                [resultStatusCode, resultMessage] = [401, message || 'Нет доступа']
                break

            case '404':
                [resultStatusCode, resultMessage] = [404, message || 'Не найдено']
                break

            case '400':
                [resultStatusCode, resultMessage] = [400, message || 'Ошибка']
                break
        }
    }

    res.status(resultStatusCode).json({ error: true, message: resultMessage })
}