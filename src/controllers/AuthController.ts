import type{Request, Response} from 'express' 
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

export class AuthController {

    static createAccount = async (req : Request, res: Response)=>{

        try {
            
            const {password, email} = req.body

            // Prevenir duplicados
            const userExists = await User.findOne({email})
            if(userExists)
            {
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error: error.message})
            }
            
            // Crea un Usuario
            const user = new User(req.body)

            //Hash Password
            user.password =await hashPassword(password)

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            
            // Enviar el email
            await AuthEmail.sendConfirmationEmail({
                email:user.email,
                name: user.name,
                token:token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')

        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }
    
    static confirmAccount = async (req : Request, res: Response)=>{

        try {
            const {token}= req.body
            
            const tokenExist = await Token.findOne({token})
            
            if(!tokenExist)
            {
                const error = new Error('Token no válido')
                return res.status(404).json({error:error.message})
            }

            const user= await User.findById(tokenExist.user)
            user.confirmed = true
            await Promise.allSettled([user.save(),tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

    static login = async (req : Request, res: Response)=>{

        try {

            const {email,password} = req.body
            const user = await User.findOne({email})
            if(!user)
            {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({error:error.message})
            }

            if(!user.confirmed)
            {
                
                await Token.deleteMany({user:user._id})

                const token = new Token()
                token.token = generateToken()
                token.user = user._id
                token.token = generateToken()
                
                await Promise.allSettled([user.save(), token.save()])
                
                 // Enviar el email
                await AuthEmail.sendConfirmationEmail({
                email:user.email,
                name: user.name,
                token:token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                return res.status(401).json({error:error.message})
            }


            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            
            if(!isPasswordCorrect)
            {
                const error = new Error('Password Incorrecto')
                return res.status(401).json({error:error.message}) 
            }

            const token = generateJWT({id: user._id.toString()})
            res.send(token)

        } catch (error) {
            console.log(error)
            res.status(500).json({error:"Hubo un error"})
        }
    }

    static requestConfirmationCode = async (req : Request, res: Response)=>{

        try {
            
            const {email} = req.body

            // Usuario Exista
            const user = await User.findOne({email})
            if(!user)
            {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})
            }

            if(user.confirmed){
                const error = new Error('El usuario ya está confirmado')
                return res.status(409).json({error: error.message})
            }

            await Token.deleteMany({user:user._id})

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            
            // Enviar el email
            await AuthEmail.sendConfirmationEmail({
                email:user.email,
                name: user.name,
                token:token.token
            })
            
            await token.save()
            res.send('Se envio un nuevo token a tu email')

        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

    static forgotPassword = async (req : Request, res: Response)=>{

        try {
            
            const {email} = req.body

            // Usuario Exista
            const user = await User.findOne({email})
            if(!user)
            {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})
            }

            await Token.deleteMany({user:user._id})

            // Generar Token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await token.save()

            // Enviar el email
            await AuthEmail.sendPasswordResetToken({
                email:user.email,
                name: user.name,
                token:token.token
            })
            
            res.send('Revisa tu email para instrucciones')

        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

    static validateToken = async (req : Request, res: Response)=>{

        try {
            const {token}= req.body
            
            const tokenExist = await Token.findOne({token})
            
            if(!tokenExist)
            {
                const error = new Error('Token no válido')
                return res.status(404).json({error:error.message})
            }

            res.send('Token válido, define tu nuevo password')
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

     static updatePasswordWithToken = async (req : Request, res: Response)=>{

        try {
            const {token}= req.params
            const {password} = req.body
            const tokenExist = await Token.findOne({token})
            
            if(!tokenExist)
            {
                const error = new Error('Token no válido')
                return res.status(404).json({error:error.message})
            }
            
            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)
            
            await Promise.allSettled([ user.save(), tokenExist.deleteOne()])
            res.send('El password se modifico correctamente')
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }

    static user = async (req : Request, res: Response)=>{
        return res.json(req.user)
    }
    
    static updateProfile = async (req : Request, res: Response)=>{

        const {name, email} = req.body
        try {

            const userExist = await User.findOne({email})
            if(userExist && userExist.id.toString() !== req.user._id.toString())
            {
                const error = new Error('Ese Email ya está Registrado')
                return res.status(409).json({error:error.message})
            }

            req.user.name = name
            req.user.email = email

            await req.user.save()
            res.send('Perfil Actualizado Correctamente')
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }

    }

    static updateCurrentUserPassword = async (req : Request, res: Response)=>{
        
        const {current_password,password} = req.body
        
        try {
            const user = await User.findById(req.user._id)
            
            if(current_password === password)
            {
                 const error = new Error('El password Nuevo no puede ser el mismo que el actual')
                return res.status(401).json({error:error.message})
            }

            const isPasswordCorrect = await checkPassword(current_password, user.password)

            if(!isPasswordCorrect)
            {
                const error = new Error('El Password Actual es Incorrecto')
                return res.status(401).json({error:error.message})
            }

            user.password = await hashPassword(password)
            await user.save()
            res.send('El Password se Modificó Correctamente')

        } catch (error) {
            
        }
    }

    static checkPassword = async (req : Request, res: Response)=>{

          const {password} = req.body
        
        try {
            const user = await User.findById(req.user._id)
            
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect)
            {
                const error = new Error('El Password es Incorrecto')
                return res.status(401).json({error:error.message})
            }

             } catch (error) {                       
        }

            res.send('Password Correcto')
    }   

}