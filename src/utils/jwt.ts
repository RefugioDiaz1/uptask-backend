import jwt from 'jsonwebtoken'

export const generateJWT = () =>{
    const data = {
        name: 'Refugio',
        credit_card: '124545454',
        password: 'password'
    }
    const token  = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '6m'
    })

    return token
}   