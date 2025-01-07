const forgetPasswordTemplate = (user) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Verification Email</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }
  
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
  
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
          }
  
          .body {
              font-size: 16px;
              margin-bottom: 20px;
          }
  
          .cta {
              display: inline-block;
              padding: 10px 20px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
          }
  
          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
  
          .highlight {
              font-weight: bold;
          }
      </style>
  
  </head>
  
  <body>
      <div class="container">
          <a href="https://proteinslice.com"><img class="logo"
                  src="https://proteinslice.com/proteinslice-logo-transparent.png" alt="Protenslice Logo"></a>
          <div class="message">Forgot Your Password?</div>
          <div class="body">
              <p>Dear ${user?.fullname}</p>
              <p>We received a request to reset your password for your ProteinSlice account. We understand that forgetting passwords can happen to anyone, so no worries, we've got you covered!</p>
              <p>To reset your password, simply click on the link below:</p>
              <a class="highlight" href="https://proteinslice.com/reset-password?code=${user.code}&email=${user.email}">Click Here</a>
              <p>If clicking the link doesn't work, copy and paste the URL into your browser's address bar.: https://proteinslice.com/reset-password?code=${user.code}&email=${user.email} </p>

              <p>Once you've clicked the link, you'll be prompted to enter a new password. Please choose a password that is secure and unique to ensure the safety of your account.</p>
              <p>This Link is valid for 30 minutes. If you did not request this password reset, please ignore this email. Your account security is important to us, and we recommend keeping your password confidential and regularly updating it for added security.</p>
          </div>
          <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                  href="mailto:contact@proteinslice.com">contact@proteinslice.com</a>. We are here to help!</div>
      </div>
  </body>
  
  </html>`;
};
export { forgetPasswordTemplate };
