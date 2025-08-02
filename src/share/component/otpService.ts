import { randomInt } from 'crypto'
import Redis from 'ioredis'
import { IOtpService } from '../interface';
export class OtpService implements IOtpService {
  private redis: Redis

  constructor(redis: Redis) {
    this.redis = redis
  }

  // Sinh OTP 6 chữ số và lưu vào Redis
  async generate(email: string): Promise<{ otp: string; createdAt: number }> {
  const otp = randomInt(100000, 999999).toString(); // OTP 6 số
  const key = `otp:${email}`;
  const createdAt = Date.now(); // Thời gian tạo (miliseconds)

  // Lưu OTP vào Redis với TTL 1 phút
  await this.redis.set(key, otp, 'EX', 60);

  // Trả về cả OTP và thời điểm tạo
  return { otp, createdAt };
}

  // Xác thực OTP
  async validate(email: string, inputOtp: string): Promise<boolean> {
    const key = `otp:${email}`
    const otp = await this.redis.get(key)
    if (otp === inputOtp) {
      await this.redis.del(key) // OTP dùng 1 lần
      return true
    }
    return false
  }
}