const contactMail = (user) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Contact form Confirmation Email</title>
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
          <div class="message">Thankyou for contacting us</div>
          <div class="body">
              <p>Dear ${user?.fullName}</p>
              <p>Thank you for reaching out to ProteinSlice, where your health and wellness are our top priorities.</p>

              <p>We appreciate you taking the time to connect with us. We aim to provide exceptional service and support to all our valued customers, and your inquiry is important to us.</p>

              <p>You have contacted Proteinslice regarding <b>Subject</b>: ${user.subject}</p>
              <p> If you Want to add anything to it you can reply to this email.</p>
              
              <p>This email is send to ${user.email}. If you have not contaced us, please disregard this email.</p>
          </div>
          <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                  href="mailto:contact@proteinslice.com">contact@proteinslice.com</a>. We are here to help!</div>
      </div>
  </body>
  
  </html>`;
};
export { contactMail };
