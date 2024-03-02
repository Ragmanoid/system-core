import { Response, NextFunction } from 'express'
import { validationResult } from "express-validator";

export default (req: any, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(req.body)
        console.log(errors.array())
        throw new Error(`[400] Не все поля заполнены`)
    }

    next()
}