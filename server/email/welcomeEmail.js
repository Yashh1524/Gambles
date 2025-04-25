const generateWelcomeEmail = (name, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
  
          .container {
            max-width: 600px;
            margin: 50px auto;
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
  
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
  
          .header h1 {
            color: #4CAF50;
          }
  
          .content {
            margin: 30px 0;
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
  
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            color: #FFFF
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
  
          .footer {
            text-align: center;
            font-size: 13px;
            color: #999;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Auth Template 👋</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with us! We're excited to have you on board.</p>
            <p>You can now log in and start building awesome projects faster using this MERN Auth Template.</p>
            <a href="${loginUrl}" class="button">Login Now</a>
          </div>
          <div class="footer">
            <p>&copy; 2025 Auth Template. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
};

export default generateWelcomeEmail
