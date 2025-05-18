export const AccountRecoveryDoneTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        *,
        *:before,
        *:after {
          box-sizing: border-box;
          margin: 0;
        }
    
        html,
        body {
          height: 100%;
          font-family: 'Helvetica', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Arial, sans-serif;
          font-size: 16px;
          word-spacing: 1px;
          background-color: gray;
        }
    
        .mail-container {
          max-width: 581px;
          margin: auto;
          background-color: #fff;
          padding: 24px;
        }
    
        .mail-logo-wrapper {
          height: 114.87px;
          background-color: #12FF55;
          border-radius: 20px;
          display: grid;
          place-items: center;
        }
    
        .mail-name {
          margin-top: 23px;
        }
    
    
        .mail-text4 {
          font-weight: bold;
        }
    
        .mail-text3 {
          display: block;
          margin-top: 23px;
        }
    
        .mail-text-5 {
          display: block;
          font-size: 14px;
          color: #828282;
          text-align: center;
          margin-top: 16px;
        }
    
        .mail-text-6 {
          font-size: 18px;
          font-weight: bold;
          margin-top: 16px;
          display: block;
          text-align: center;
        }
    
        .mail-done {
          font-size: 22px;
          font-weight: bold;
          margin-top: 30px;
        }
    
        .mail-notice {
          margin-top: 30px;
        }
    
        .mail-team {
          text-decoration: underline;
          font-weight: bold;
        }
    
        .mail-line {
          height: 1px;
          background-color: black;
          margin-top: 16px;
        }
    
        .mail-instagram {
          display: block;
          margin: 16px auto 16px auto;
        }
    
        .mail-social-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
    
        }
    
        .mail-divider {
          color: #828282;
        }
    
        .mail-link {
          text-decoration: none;
          color: inherit;
        }
    
        .mail-social {
          text-decoration: underline;
          font-weight: bold;
        }
      </style>
    </head>
    
    <body>
      <div class="mail-container">
        <div class="mail-logo-wrapper">
          <img src="https://yvievpygnysrufdcakbz.supabase.co/storage/v1/object/public/emails//logoEmail.png" />
        </div>
    
        <h3 class="mail-name">Ola, ${name},</h3>
    
        <p class="mail-done">Sua nova senha foi cadastrada com sucesso!</p>
    
        <p class="mail-notice">Se você não solicitou essa alteração, entre em contato imediatamente com <span class="mail-team">o nosso time de atendimento</span> para tentar recuperar sua conta.</p>
    
        <span class="mail-text3">Abraços,<Br />Time <span class="mail-text4">Meu Desafio 💚</span></span>
    
        <div class="mail-line"></div>
    
        <span class="mail-text-5">Este e-mail é gerado automaticamente pelo nosso sistema. Não responda.</span>
    
        <span class="mail-text-6">Siga-nos nossa rede:</span>
    
        <img class="mail-instagram" src="https://yvievpygnysrufdcakbz.supabase.co/storage/v1/object/public/emails//insta.png" />
    
        <div class="mail-social-wrapper">
          <a target="_blank" class="mail-link" href="https://www.meudesafio.com.br/">
            <span class="mail-social">Website</span>
          </a>
          <span class="mail-divider">|</span>
          <a target="_blank" class="mail-link" href="https://www.google.com.br/">
            <span class="mail-social">App store</span>
          </a>
          <span class="mail-divider">|</span>
          <a target="_blank" class="mail-link">
            <span class="mail-social">Google Play</span>
          </a>
          <span class="mail-divider">|</span>
          <a target="_blank" class="mail-link">
            <span class="mail-social">Fale conosco</span>
          </a>
        </div>
    
    
      </div>
    </body>
    
    </html>   
`;
};
