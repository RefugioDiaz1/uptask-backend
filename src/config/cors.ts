import {CorsOptions} from 'cors'

export const corsConfig : CorsOptions= {
    origin: function(origin, callback)
    {
        const whitelist = [process.env.FRONTEND_URL]
        
        if (!origin) {
            // Permite acceso directo desde navegador o herramientas como Postman
            return callback(null, true)
        }

        if(whitelist.includes(origin))
        {
            callback(null, true)
        }else{
            callback(new Error('Error de Cors'))
        }
    }
}