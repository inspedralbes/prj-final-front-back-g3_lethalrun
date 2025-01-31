import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

// Configurar OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: async () => {
      const { token } = await oauth2Client.getAccessToken();
      return token;
    },
  },
});

// Función para enviar un correo con un botón y contenido centrado
const sendEmailWithButton = async (email, link) => {
  // HTML del correo con el contenido centrado y un botón
  const htmlContent = `
    <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .email-container {
        text-align: center;
        background-color: #f4f4f9;
        padding: 30px;
        border-radius: 8px;
        width: 100%;
        max-width: 600px;
      }
      .email-container h1 {
        color: #333;
      }
      .email-container p {
        color: #666;
        font-size: 16px;
      }
      .btn {
        display: inline-block;
        background-color: #007bff;
        color: white;
        font-size: 18px;
        padding: 15px 25px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>¡Bienvenido!</h1>
      <p>Gracias por registrarte. Para continuar, por favor haz clic en el siguiente botón para verificar tu cuenta:</p>
      
      <!-- Formulario para hacer la solicitud POST -->
      <form action="${link}" method="POST">
        <button type="submit" class="btn">Verificar Cuenta</button>
      </form>
    </div>
  </body>
</html>`;


  const mailOptions = {
    from: `"Soporte" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${email}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};

// Exportar la función de envío de correo
export { sendEmailWithButton };
