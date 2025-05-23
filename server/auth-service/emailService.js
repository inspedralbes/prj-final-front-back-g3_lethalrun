import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

/**
 * Configuración del cliente OAuth2 para autenticación con Google.
 * Permite obtener un token de acceso para enviar correos a través de Gmail usando OAuth2.
 * @type {google.auth.OAuth2}
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// Establece las credenciales para el cliente OAuth2 usando el refresh token.
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  scope: 'https://www.googleapis.com/auth/gmail.send'
});

/**
 * Configura el transporter de nodemailer para enviar correos a través de Gmail
 * utilizando autenticación OAuth2.
 * @type {nodemailer.Transporter}
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: oauth2Client.getAccessToken()
  },
});

/**
 * Envía un correo electrónico de verificación de cuenta.
 *
 * Esta función genera un correo HTML personalizado para que el usuario verifique su cuenta.
 * El enlace de verificación debe llevar al frontend donde el usuario completará el proceso.
 *
 * @param {string} email - Dirección de correo electrónico del destinatario.
 * @param {string} link - Enlace de verificación que se incluirá en el correo.
 * @returns {Promise<void>} - Promesa que se resuelve cuando el correo ha sido enviado.
 * @throws {Error} - Si ocurre algún error durante el envío del correo.
 */
const sendVerificationEmail = async (email, link) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo Profesional</title>
    <!--[if mso]>
    <style type="text/css">
    table, td {border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
    </style>
    <![endif]-->
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
        }
        .email-container {
            width: 100%;
            background-color: #f8f9fa;
        }
        .email-content {
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 10px;
        }
        h1 {
            color: #2c3e50;
            font-size: 28px;
            margin-bottom: 20px;
        }
        p {
            color: #34495e;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .btn {
            background-color: #3498db;
            color: white;
            font-size: 18px;
            font-weight: bold;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            font-size: 14px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="email-container" style="max-width: 600px;">
        <tr>
            <td align="center" valign="top" style="padding: 40px 10px; background-color: #f8f9fa;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-content" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px; background-color: #ffffff; border-radius: 10px;">
                            <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px;">¡Bienvenido a Nuestra Plataforma!</h1>
                            <p style="color: #34495e; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">Gracias por registrarte en nuestro servicio. Para garantizar la seguridad de tu cuenta y comenzar a disfrutar de todos nuestros beneficios, por favor verifica tu dirección de correo electrónico haciendo clic en el botón a continuación:</p>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius: 5px;" bgcolor="#3498db">
                                        <a href="${link}" target="_blank" style="font-size: 18px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; border: 1px solid #3498db; display: inline-block; font-weight: bold;">Verificar mi cuenta</a>
                                    </td>
                                </tr>
                            </table>

                            <p class="footer" style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">Si no has solicitado esta verificación, por favor ignora este mensaje.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const mailOptions = {
    from: `"Soporte" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Envía un correo electrónico para restablecer la contraseña.
 *
 * Esta función genera un correo HTML personalizado para que el usuario pueda restablecer su contraseña.
 * El enlace debe llevar a una página donde el usuario podrá ingresar una nueva contraseña.
 *
 * @param {string} email - Dirección de correo electrónico del destinatario.
 * @param {string} link - Enlace para restablecer la contraseña.
 * @returns {Promise<void>} - Promesa que se resuelve cuando el correo ha sido enviado.
 * @throws {Error} - Si ocurre algún error durante el envío del correo.
 */
const sendPasswordResetEmail = async (email, link) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
    <!--[if mso]>
    <style type="text/css">
    table, td {border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
    </style>
    <![endif]-->
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; height: 100%; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; background-color: #f8f9fa;">
        <tr>
            <td align="center" valign="top" style="padding: 40px 10px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px;">
                            <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px;">Restablecimiento de Contraseña</h1>
                            <p style="color: #34495e; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si has realizado esta solicitud, por favor haz clic en el botón a continuación para crear una nueva contraseña:</p>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius: 5px;" bgcolor="#3498db">
                                        <a href="${link}" target="_blank" style="display: inline-block; background-color: #3498db; color: white; font-size: 18px; font-weight: bold; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Restablecer mi contraseña</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">Si no has solicitado este cambio, puedes ignorar este correo. Tu cuenta permanece segura.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const mailOptions = {
    from: `"Soporte" <${process.env.EMAIL}>`,
    to: email,
    subject: "Restablecer tu contraseña",
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// Exportar las funciones de envío de correo para su uso en otros módulos
export { sendVerificationEmail, sendPasswordResetEmail };
