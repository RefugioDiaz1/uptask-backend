import jwt from 'jsonwebtoken'

type UserPayload = {
    id: String
}

export const generateJWT = (payload: UserPayload) =>{
    console.log(payload)
    const token  = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    
    return token
}   