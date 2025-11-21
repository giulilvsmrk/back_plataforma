import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendConfirmationEmail(user: UserEntity, token: string) {
    const confirmationUrl = `${this.configService.get<string>('API_HOST')}/auth/confirm?token=${token}`;

    await this.transporter.sendMail({
      from: `"Plataforma Educativa" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: user.email,
      subject: '¡Bienvenido! Por favor, confirma tu correo electrónico',
      html: `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Correo</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 20px; background-color: #4A90E2; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 28px;">Plataforma Educativa</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                    <h2 style="font-size: 24px; margin-top: 0;">¡Hola ${user.name}!</h2>
                    <p>¡Gracias por registrarte en nuestra plataforma! Estamos muy contentos de tenerte con nosotros.</p>
                    <p>Para completar tu registro y activar tu cuenta, por favor, haz clic en el siguiente botón:</p>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${confirmationUrl}" target="_blank" style="background-color: #4CAF50; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 18px; display: inline-block;">Confirmar mi cuenta</a>
                        </td>
                      </tr>
                    </table>
                    <p>Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:</p>
                    <p style="word-break: break-all;"><a href="${confirmationUrl}" target="_blank" style="color: #4A90E2;">${confirmationUrl}</a></p>
                    <p>Si no te registraste en nuestra plataforma, por favor, ignora este correo electrónico.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
    });
  }
}
