import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, //Cada 3 minutos
	limit: 40, // Tiene la posibilidad de realizar 40 solicitudes cada 3 minutos
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
