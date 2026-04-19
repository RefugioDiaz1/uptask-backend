import { resend } from '../config/resend'

interface IEmail{
    email:string
    name: string
    token: string
}

export class AuthEmail{
    static sendConfirmationEmail = async(user: IEmail)=>{
        const confirmUrl = `${process.env.FRONTEND_URL || 'https://uptask.com'}/auth/confirm-account`

        const info = await resend.emails.send({
                from: 'UpTask <onboarding@resend.dev>',
                to: user.email,
                subject: 'UpTask - Confirma tu cuenta',
                text: `Hola ${user.name}, por favor confirma tu cuenta con este token: ${user.token}`,
                html: `
                    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
                        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.08);">
                            <div style="background:#2f6bff; color:#fff; padding:20px 25px; text-align:center;">
                                <h1 style="margin:0; font-size:24px;">¡Bienvenido a UpTask!</h1>
                            </div>
                            <div style="padding:25px; color:#2f2f2f;">
                                <p style="font-size:16px; margin:0 0 16px;">Hola <strong>${user.name}</strong>,</p>
                                <p style="font-size:16px; line-height:1.5; margin:0 0 16px;">
                                    Gracias por crear tu cuenta en UpTask. Solo falta un paso para activarla.
                                </p>
                                <p style="margin:0 0 20px;text-align:center">
                                    <a href="${confirmUrl}" style="display:inline-block; background:#2f6bff; color:#fff; text-decoration:none; font-weight:700; padding:12px 20px; border-radius:6px;">Confirmar Cuenta</a>
                                </p>
                                <p style="font-size:16px; margin:0 0 8px;">Código de verificación:</p>
                                <p style="font-size:22px; font-weight:700; margin:0 0 22px; color:#3b3f4b;">${user.token}</p>
                                <p style="font-size:14px; color:#7e8293; margin:0 0 12px;">
                                    El enlace y el token expiran en <strong>10 minutos</strong>.
                                </p>
                               
                            </div>
                            <div style="background:#fafbfc; padding:15px 25px; font-size:12px; color:#8c92a1; text-align:center;">
                                <p style="margin:0;">Si no solicitaste este correo, ignóralo. UpTask - gestión de proyectos simple.</p>
                            </div>
                        </div>
                    </div>
                `
            })
    }

    static sendPasswordResetToken = async(user: IEmail)=>{
        const newpassword = `${process.env.FRONTEND_URL || 'https://uptask.com'}/auth/new-password`

        const info = await resend.emails.send({
                from: 'UpTask <onboarding@resend.dev>',
                to: user.email,
                subject: 'UpTask - Restablece tu password',
                text: `Hola ${user.name}, por favor restablece tu password con este token: ${user.token}`,
                html: `
                    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
                        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.08);">
                            <div style="background:#2f6bff; color:#fff; padding:20px 25px; text-align:center;">
                                <h1 style="margin:0; font-size:24px;">¡Bienvenido a UpTask!</h1>
                            </div>
                            <div style="padding:25px; color:#2f2f2f;">
                                <p style="font-size:16px; margin:0 0 16px;">Hola <strong>${user.name}</strong>,</p>
                                <p style="font-size:16px; line-height:1.5; margin:0 0 16px;">
                                    Has solicitado restablecer tu passsword.
                                </p>
                                <p style="margin:0 0 20px;text-align:center">
                                    <a href="${newpassword}" style="display:inline-block; background:#2f6bff; color:#fff; text-decoration:none; font-weight:700; padding:12px 20px; border-radius:6px;">Restablecer Password</a>
                                </p>
                                <p style="font-size:16px; margin:0 0 8px;">Código de verificación:</p>
                                <p style="font-size:22px; font-weight:700; margin:0 0 22px; color:#3b3f4b;">${user.token}</p>
                                <p style="font-size:14px; color:#7e8293; margin:0 0 12px;">
                                    El enlace y el token expiran en <strong>10 minutos</strong>.
                                </p>
                               
                            </div>
                            <div style="background:#fafbfc; padding:15px 25px; font-size:12px; color:#8c92a1; text-align:center;">
                                <p style="margin:0;">Si no solicitaste este correo, ignóralo. UpTask - gestión de proyectos simple.</p>
                            </div>
                        </div>
                    </div>
                `
            })

    }

}