import {CorsOptions} from 'cors'

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {

    const whitelist = [
      process.env.FRONTEND_URL
    ]

    if (!origin) return callback(null, true)

    const isAllowed = whitelist.some(url => 
      url && origin.includes(url)
    )

    if (isAllowed) {
      return callback(null, true)
    }

    return callback(new Error('Error de Cors'))
  }
}