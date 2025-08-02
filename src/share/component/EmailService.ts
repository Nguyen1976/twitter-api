import nodemailer from 'nodemailer'
import { config } from './config'
import { IEmailService } from '../interface'

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: config.email.address,
        pass: config.email.pass,
      },
    })

    // Verify connection
    this.verifyConnection()
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify()
      console.log('Email server connection verified')
    } catch (error) {
      console.error('Email server connection failed:', error)
    }
  }

  /**
   * Send generic email
   */
  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${config.email.name || 'Twitter Clone'}" <${config.email.address}>`,
        to,
        subject,
        text,
        ...(html && { html })
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log(`Email sent successfully to ${to}:`, result.messageId)
      return true
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error)
      return false
    }
  }

  /**
   * Send OTP verification email
   */
  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const subject = 'Mã xác thực OTP - Twitter Clone'
    const text = `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1DA1F2; margin: 0;">Twitter Clone</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Xác thực tài khoản</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Để hoàn tất việc tạo tài khoản, vui lòng nhập mã OTP bên dưới:
          </p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #1DA1F2; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
              ${otp}
            </h1>
          </div>
          
          <p style="color: #888; font-size: 14px; margin-top: 20px;">
            ⏰ Mã này sẽ hết hạn sau <strong>5 phút</strong>
          </p>
          <p style="color: #888; font-size: 14px;">
            🔒 Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Twitter Clone. All rights reserved.</p>
        </div>
      </div>
    `

    return await this.sendEmail(email, subject, text, html)
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    const subject = `Chào mừng ${username} đến với Twitter Clone!`
    const text = `Chào ${username}! Cảm ơn bạn đã tham gia Twitter Clone. Hãy bắt đầu khám phá và kết nối với mọi người!`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1DA1F2; margin: 0;">Twitter Clone</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #1DA1F2 0%, #1991DB 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="margin: 0 0 20px 0;">🎉 Chào mừng bạn, ${username}!</h2>
          <p style="font-size: 18px; margin: 0;">Tài khoản của bạn đã được tạo thành công</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h3 style="color: #333;">Bắt đầu hành trình của bạn:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>📝 Viết tweet đầu tiên của bạn</li>
            <li>👥 Theo dõi những người bạn quan tâm</li>
            <li>💬 Tham gia cuộc trò chuyện</li>
            <li>🔍 Khám phá xu hướng mới nhất</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
             style="background-color: #1DA1F2; color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold;">
            Bắt đầu ngay
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Twitter Clone. All rights reserved.</p>
        </div>
      </div>
    `

    return await this.sendEmail(email, subject, text, html)
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const subject = 'Đặt lại mật khẩu - Twitter Clone'
    const text = `Click vào link sau để đặt lại mật khẩu: ${resetLink}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1DA1F2; margin: 0;">Twitter Clone</h1>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #856404; margin: 0 0 15px 0;">🔐 Yêu cầu đặt lại mật khẩu</h2>
          <p style="color: #856404; margin: 0;">
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #1DA1F2; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block;">
            Đặt lại mật khẩu
          </a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            ⚠️ <strong>Lưu ý:</strong>
          </p>
          <ul style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
            <li>Link này sẽ hết hạn sau 1 giờ</li>
            <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
            <li>Không chia sẻ link này với ai khác</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Twitter Clone. All rights reserved.</p>
        </div>
      </div>
    `

    return await this.sendEmail(email, subject, text, html)
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(email: string, title: string, message: string, actionUrl?: string): Promise<boolean> {
    const subject = `Thông báo - ${title}`
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1DA1F2; margin: 0;">Twitter Clone</h1>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">📢 ${title}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${message}
          </p>
          
          ${actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" 
                 style="background-color: #1DA1F2; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
                Xem chi tiết
              </a>
            </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© 2024 Twitter Clone. All rights reserved.</p>
        </div>
      </div>
    `

    return await this.sendEmail(email, subject, message, html)
  }
}