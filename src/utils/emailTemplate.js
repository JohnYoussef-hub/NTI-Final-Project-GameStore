const template = (code, name, subject) => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #233866;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .email-body h2 {
      margin-top: 0;
      color: #233866;
    }
    .activation-button {
      display: inline-block;
      background-color: #233866;
      color: #ffffff !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      margin: 20px 0;
    }
    .activation-button:hover {
      background-color: #0056b3;
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f4f4f4;
      font-size: 14px;
      color: #777777;
    }
    .email-footer a {
      color: #233866;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up with E-commerce store. To complete your registration and start using your account, please get code to activate your account:</p>
      <h2 class="activation-button">${code}</h2>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>E-commerce store Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2025 E-commerce store. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;

const passwordResetOtpTemplate = (otp, name) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .email-header {
      background: linear-gradient(135deg, #233866 0%, #2d4a8a 100%);
      color: #ffffff;
      text-align: center;
      padding: 40px 20px;
    }
    
    .email-header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .email-header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .email-body {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #233866;
      font-weight: 600;
    }
    
    .message {
      font-size: 15px;
      color: #555555;
      margin-bottom: 30px;
    }
    
    .otp-section {
      background-color: #f8f9fa;
      border-left: 4px solid #233866;
      padding: 20px;
      margin: 30px 0;
      border-radius: 5px;
    }
    
    .otp-label {
      font-size: 12px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    
    .otp-code {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #233866;
      text-align: center;
      font-family: 'Courier New', monospace;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      border: 2px solid #e0e0e0;
    }
    
    .otp-expiry {
      font-size: 13px;
      color: #e74c3c;
      text-align: center;
      margin-top: 15px;
      font-weight: 600;
    }
    
    .steps {
      margin: 30px 0;
      background-color: #f0f7ff;
      padding: 20px;
      border-radius: 5px;
    }
    
    .steps-title {
      font-size: 16px;
      color: #233866;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .step {
      display: flex;
      margin-bottom: 15px;
      font-size: 14px;
      color: #555555;
    }
    
    .step-number {
      background-color: #233866;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .step-content {
      flex: 1;
      padding-top: 2px;
    }
    
    .security-notice {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      font-size: 13px;
      color: #856404;
    }
    
    .security-notice strong {
      display: block;
      margin-bottom: 5px;
    }
    
    .closing {
      margin-top: 30px;
      font-size: 14px;
      color: #555555;
    }
    
    .closing p {
      margin-bottom: 10px;
    }
    
    .signature {
      color: #233866;
      font-weight: 600;
    }
    
    .email-footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999999;
      font-size: 12px;
      border-top: 1px solid #e0e0e0;
    }
    
    .footer-links {
      margin-bottom: 15px;
    }
    
    .footer-links a {
      color: #233866;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    .copyright {
      color: #cccccc;
      font-size: 11px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>🔐 Reset Your Password</h1>
      <p>Secure password recovery link</p>
    </div>
    
    <div class="email-body">
      <div class="greeting">Hello ${name},</div>
      
      <p class="message">
        We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email. Your account will remain secure.
      </p>
      
      <p class="message">
        To proceed with resetting your password, please use the One-Time Password (OTP) provided below:
      </p>
      
      <div class="otp-section">
        <div class="otp-label">Your One-Time Password (OTP)</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱️ This code expires in 10 minutes</div>
      </div>
      
      <div class="steps">
        <div class="steps-title">📋 How to reset your password:</div>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">Go to the password reset page in your account</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">Enter your email address and the OTP code shown above</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">Create a new, strong password</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">Confirm your new password and submit</div>
        </div>
        <div class="step">
          <div class="step-number">5</div>
          <div class="step-content">Log in with your new password</div>
        </div>
      </div>
      
      <div class="security-notice">
        <strong>🛡️ Security Reminder:</strong>
        Never share your OTP with anyone. Our team will never ask for your OTP via email or phone. If you didn't request this password reset, please change your account security settings immediately.
      </div>
      
      <div class="closing">
        <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br><span class="signature">Game Store Team</span></p>
      </div>
    </div>
    
    <div class="email-footer">
      <div class="footer-links">
        <a href="[SupportLink]">Support</a> |
        <a href="[PrivacyLink]">Privacy Policy</a> |
        <a href="[TermsLink]">Terms of Service</a>
      </div>
      <div class="copyright">
        &copy; 2025 Game Store. All rights reserved.<br>
        This is an automated message. Please do not reply to this email.
      </div>
    </div>
  </div>
</body>
</html>`;

const emailVerificationTemplate = (otp, name) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .email-header {
      background: linear-gradient(135deg, #233866 0%, #2d4a8a 100%);
      color: #ffffff;
      text-align: center;
      padding: 40px 20px;
    }
    
    .email-header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .email-header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .email-body {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.8;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #233866;
      font-weight: 600;
    }
    
    .message {
      font-size: 15px;
      color: #555555;
      margin-bottom: 30px;
    }
    
    .otp-section {
      background-color: #f8f9fa;
      border-left: 4px solid #27ae60;
      padding: 20px;
      margin: 30px 0;
      border-radius: 5px;
    }
    
    .otp-label {
      font-size: 12px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    
    .otp-code {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #27ae60;
      text-align: center;
      font-family: 'Courier New', monospace;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      border: 2px solid #e0e0e0;
    }
    
    .otp-expiry {
      font-size: 13px;
      color: #e74c3c;
      text-align: center;
      margin-top: 15px;
      font-weight: 600;
    }
    
    .benefits {
      margin: 30px 0;
      background-color: #f0fdf4;
      padding: 20px;
      border-radius: 5px;
    }
    
    .benefits-title {
      font-size: 16px;
      color: #233866;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .benefit {
      display: flex;
      margin-bottom: 12px;
      font-size: 14px;
      color: #555555;
    }
    
    .benefit-icon {
      color: #27ae60;
      font-weight: bold;
      margin-right: 12px;
      font-size: 16px;
    }
    
    .benefit-content {
      flex: 1;
    }
    
    .steps {
      margin: 20px 0;
      background-color: #f0f7ff;
      padding: 20px;
      border-radius: 5px;
    }
    
    .steps-title {
      font-size: 16px;
      color: #233866;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .step {
      display: flex;
      margin-bottom: 15px;
      font-size: 14px;
      color: #555555;
    }
    
    .step-number {
      background-color: #27ae60;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .step-content {
      flex: 1;
      padding-top: 2px;
    }
    
    .security-notice {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      font-size: 13px;
      color: #1565c0;
    }
    
    .security-notice strong {
      display: block;
      margin-bottom: 5px;
    }
    
    .closing {
      margin-top: 30px;
      font-size: 14px;
      color: #555555;
    }
    
    .closing p {
      margin-bottom: 10px;
    }
    
    .signature {
      color: #233866;
      font-weight: 600;
    }
    
    .email-footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999999;
      font-size: 12px;
      border-top: 1px solid #e0e0e0;
    }
    
    .footer-links {
      margin-bottom: 15px;
    }
    
    .footer-links a {
      color: #233866;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    .copyright {
      color: #cccccc;
      font-size: 11px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>✓ Verify Your Email</h1>
      <p>Complete your account registration</p>
    </div>
    
    <div class="email-body">
      <div class="greeting">Welcome to Game Store, ${name}!</div>
      
      <p class="message">
        Thank you for signing up! We're excited to have you join our gaming community. To complete your registration and unlock all features, please verify your email address using the One-Time Password (OTP) below.
      </p>
      
      <div class="otp-section">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱️ This code expires in 10 minutes</div>
      </div>
      
      <div class="steps">
        <div class="steps-title">📋 How to verify your email:</div>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">Navigate to the email verification page</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">Enter the verification code shown above</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">Click "Verify" to activate your account</div>
        </div>
      </div>
      
      <div class="benefits">
        <div class="benefits-title">🎮 What you can do after verification:</div>
        <div class="benefit">
          <div class="benefit-icon">✓</div>
          <div class="benefit-content">Browse our entire game library</div>
        </div>
        <div class="benefit">
          <div class="benefit-icon">✓</div>
          <div class="benefit-content">Add games to your wishlist</div>
        </div>
        <div class="benefit">
          <div class="benefit-icon">✓</div>
          <div class="benefit-content">Make purchases with secure checkout</div>
        </div>
        <div class="benefit">
          <div class="benefit-icon">✓</div>
          <div class="benefit-content">Track your order history</div>
        </div>
        <div class="benefit">
          <div class="benefit-icon">✓</div>
          <div class="benefit-content">Receive exclusive offers and updates</div>
        </div>
      </div>
      
      <div class="security-notice">
        <strong>🔒 Security Note:</strong>
        Never share your verification code with anyone. Our team will never ask for your OTP via email or phone. Keep your code private!
      </div>
      
      <div class="closing">
        <p>Didn't receive this email or need another code? You can request a new verification code in your account settings.</p>
        <p>Best regards,<br><span class="signature">Game Store Team</span></p>
      </div>
    </div>
    
    <div class="email-footer">
      <div class="footer-links">
        <a href="[SupportLink]">Support</a> |
        <a href="[PrivacyLink]">Privacy Policy</a> |
        <a href="[TermsLink]">Terms of Service</a>
      </div>
      <div class="copyright">
        &copy; 2025 Game Store. All rights reserved.<br>
        This is an automated message. Please do not reply to this email.
      </div>
    </div>
  </div>
</body>
</html>`;

module.exports = {
  template,
  passwordResetOtpTemplate,
  emailVerificationTemplate,
};
