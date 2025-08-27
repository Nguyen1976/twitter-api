import { Router } from 'express'


export function buildAuthRouter(usecases: ReturnType<typeof import('./tweet.usecases').buildTweetUseCases>) {



  const router = Router()

  return router
}

/**
 * Phân tích việc create tweet vì sẽ có 4 loại
 * - TWEET: Tweet thông thường
 *  với tweet thông thường sẽ cần nhận vào: 
 * userId 
 * contentText  
 * type: TWEET 
 * ảnh hoặc video nếu có 
 * nhận vào form data từ fe để xử lý media và upload lên cloudianry
 * validate: 1 tweet chỉ được 4 ảnh hoặc 1 video
 * 
 * 
 * 
 * - REPLY: Phản hồi đến một tweet khác
 * nhận vào userId
 * contentText
 * type: REPLY
 * parentTweetId
 * media: tối đa 4 image và k được nhận vào video
 * 
 * 
 * - QUOTE: Trích dẫn một tweet khác
 *
 * Nhận vào userId
 * contentText
 * type: QUOTE
 * parentTweetId
 * media: tối đa 4 image hoặc 1 video
 * 
 * 
 * 
 * 
 * - RETWEET: Chia sẻ một tweet khác
 * 
 * hay còn gọi là repost tức là chỉ dùng danh nghĩa cá nhận hiển thị lại 1 tweet cha khác
 * type: RETWEET
 * userId
 * parentTweetId
 * và phần like reply hay retweet repost sẽ được tính vào post cha
 */
