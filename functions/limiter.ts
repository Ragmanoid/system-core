import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export const getLimiter = (rpm: number = 200, chunkMinutesTime: number = 5): RateLimitRequestHandler => {
    return rateLimit({
        windowMs: chunkMinutesTime * 60 * 1000, // 5 min
        max: rpm / chunkMinutesTime,
        message: 'Слишком много запросов с одного IP адреса',
        // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
}