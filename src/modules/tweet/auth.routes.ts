import { Router } from 'express'

export function buildAuthRouter(
  usecases: ReturnType<typeof import('./tweet.usecases').buildTweetUseCases>
) {
  const router = Router()

  // router.post('/')//tweet thông thường
  // router.post('/reply')//reply
  // router.post('/requote')//quote
  // router.post('/repost')//retweet

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


//sau đó xây dựng timeline dựa trên phương thức ranking based (suy nghĩ sau)
//việc cập nhật timeline
/**
 * fan out on write(đẩy ngay khi tweet được tạo)
 * khi 1 userA đăng 1 tweet, hệ thống sẽ lấy id của tweet đó và fanout phát tán đến tất cả các timeline folower của A
 * timeline sẽ được lưu trong redis
 * => khi user đăng tweet fanout sẽ sảy ra
 * ưu điểm đọc rẻ
 * ghi chậm
 *
 * fan out on read(ghép timeline khi user mở app)
 * khi user B mở app và req timeline
 * hệ thống sẽ lấy danh sách những người B follow
 * lấy tweet mới nhất từ họ (từ DB hoặc index)
 * ưu điểm ghi rẻ
 * đọc chậm
 *
 * với 2 giải pháp trên ta có thể chọn ngay ra giải pháp fan out on write
 * bởi vì cái việc ghi tức là cái việc broad card cho tất cả timeline của user khác tốn kém chúng ta có thể khắc phục bằng cách sử dụng bull mq để chạy dưới nền
 * khi user đăng tweet thì vẫn sẽ lưu vào db nhưng hành động broad card sẽ đưa vào queue
 *
 *
 * Nhưng thực tế thì twitter hoặc 1 số mạng lớn khác dùng hybrid
 * Tức là với user ít followers dùng fan out on write
 * với user nhiều followers dùng fan out on read
 *
 * và tiếp theo timeline sẽ chia thành 2 loại chính for you và following
 * tab following thì thiết kế theo gióng thời gian chung thực nó k quan tâm mình xem hay chưa và nó sẽ hiển thị khoảng tweet nhất định và theo từ mới đến cũ nhất
 * => timeline rất lớn và k có kiểu tweet nào xem t thì sẽ không được hiển thị và nó sẽ là timeline on write
 *
 * với tab for you xử lý sẽ phức tạp hơn vì đây là dưới dạng algorithm feed(recommendation + ranking)
 * bao gồm tweet từ người mình  follow
 * tweet từ những người k follow nhưng hệ thống nghĩ là mình thích dựa trên trending hay ML model
 *
 * các tweet được scored dựa trên follow relationship, thời gian, độ hot, chủ đề mà ta quan tâm và hiển thị theo ranking và nó mang tính tự học từ hành vi của chúng ta(khó......)
 *
 * pipeline:
 * (1)
 * chọn ra các ứng viên
 * mục tiêu: thu nhập 1 tập hợp tweets tiềm năng để đưa vào timeline feed 'For you'
 * nguồn tweets dựa trên:
 * những người mình follow
 * từ người là những được rcm thông qua graph db(ví dụ mình follow A, A thích tweet của B => tweet B được rcm)
 * tweets mới đăng gần đây, hot trends, reply/quote đang nổi
 * có thể lấy ra được 1 số lượng candidate ví dụ như 1500-2000 tweets
 *
 * (2) Filtering
 * sau khi có list candidate, hệ thống lọc bỏ những cái k hợp lệ:
 * tweets mà đã thấy rồi
 * tweets bị block/mute/report
 * tweets quá cũ
 * nội dung k phù hợp spam, vi phạm, policy
 *
 * => sau khi lọc sẽ còn khoảng vài trăm
 *
 * (3)Ranking
 * tweets gán điểm cho từng tweet dựa trên nhiều signal
 * engagement prediction: khả năng bạn like, retweet, reply, click vào
 * author quality: độ uy tín, influence của người đăng
 * similarity: mức độ liên quan giữa bạn và tác giả(dựa trên graph)
 * recency: độ mới của tweet
 *  diversity: tránh để feed toàn 1 người
 *
 * => cuối cùng sẽ đưa ra khoảng tweet nhất định mà có điểm cao
 *
 *
 *
 * cơ chế update timeline
 * ví dụ mục tiêu hiển thị 150 tweet thì lần đầu vào sẽ load 300 tweet và hiển thị 150
 * lần fetch tiếp theo là 150 và 300 tweet mới chạy dưới nền để update pipeline tức nội dung sẽ luôn được cbij trong timeline
 * trong th pipeline k kịp khi user load quá nhanh  có thể fallback từ candidates cũ nhưng re-rank ví dụ theo time hay trending
 *
 *
 */
