import { CourseModule } from '../types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    title: 'Mô-đun 1: Nền tảng Google AI Studio',
    subtitle: 'Khám phá môi trường Build mode & tư duy chuyển đổi giáo án',
    description: 'Trang bị kiến thức căn bản về công cụ Google AI Studio, sự khác biệt giữa Chat mode và Build mode, cùng các nguyên tắc bảo mật thông tin sư phạm.',
    icon: 'Sparkles',
    lessons: [
      {
        id: '1.1',
        title: 'Giới thiệu Google AI Studio',
        duration: '15 phút',
        summary: 'Tìm hiểu tổng quan về Google AI Studio - công cụ đột phá giúp giáo viên sáng tạo ứng dụng học tập tương tác chạy thật.',
        contentMarkdown: `
### 1. Kịch bản bài giảng & Đặt vấn đề
Thưa thầy cô, trong kỷ nguyên chuyển đổi số giáo dục, thách thức lớn nhất của thầy cô không phải là thiếu tài liệu, mà là **làm sao để chuyển hóa bài giảng thành trải nghiệm tương tác sinh động** khiến học sinh chủ động tham gia.

Google AI Studio ra đời như một giải pháp đột phá. Đây không chỉ là một công cụ chat AI thông thường, mà là môi trường phát triển ứng dụng trực tiếp từ mô hình Gemini tiên tiến nhất của Google.

### 2. So sánh chi tiết: Chat mode vs Build mode

| Tiêu chí | Chat mode (Trò chuyện) | Build mode (Xây dựng Webapp) |
| :--- | :--- | :--- |
| **Đầu ra (Output)** | Văn bản, danh sách câu hỏi, tóm tắt bài | Một **Mini Webapp hoàn chỉnh** (HTML, CSS, JS) |
| **Tương tác** | Đọc - Chép - Trả lời text | Kéo thả, bấm nút, nhận hiệu ứng âm thanh & hình ảnh |
| **Trải nghiệm học sinh** | Bị động đọc câu trả lời | Chủ động chơi game, thi đua điểm số, xem giải thích |
| **Ứng dụng thực tế** | Soạn giáo án, viết đề thi | Game khởi động đầu giờ, Ôn tập giữa giờ, Bài tập về nhà |

### 3. Lợi ích cho Giáo viên FPT School Bắc Giang
* **Không cần biết lập trình:** Chỉ cần mô tả ý tưởng bằng văn bản (Prompt), AI sẽ viết code và dựng sẵn giao diện.
* **Đúng tinh thần "Trải nghiệm để trưởng thành!":** Học sinh được tự mình trải nghiệm qua các thử thách tương tác.
* **Lưu trữ & Chia sẻ dễ dàng:** Webapp chạy client-side trên trình duyệt, gửi được đường link cho học sinh tự ôn tập mọi lúc mọi nơi.
        `,
        keyTakeaways: [
          'Google AI Studio cho phép biến giáo án thành Mini Webapp học tập mà không cần dòng code nào.',
          'Build mode tự động tạo ứng dụng chạy tương tác thật (HTML/CSS/JS) ngay trong trình duyệt.',
          'Tiết kiệm 80% thời gian chuẩn bị trò chơi khởi động và bài tập ôn tập tương tác.'
        ]
      },
      {
        id: '1.2',
        title: 'Làm quen môi trường Build mode',
        duration: '20 phút',
        summary: 'Nắm vững giao diện Build mode, thanh công cụ, ô nhập System Instructions và cửa sổ xem trước Live Preview.',
        contentMarkdown: `
### 1. Hướng dẫn thao tác giao diện Build mode
Khi truy cập [aistudio.google.com](https://aistudio.google.com/) và chọn **Create New App / Build mode**, giao diện được chia thành 3 khu vực quan trọng:

1. **System Instructions (Chỉ dẫn hệ thống):** Nơi dán **Master Prompt** được tạo từ Cổng Tập Huấn. Đây là "bản thiết kế kỹ thuật" định hình toàn bộ giao diện, luật chơi và nội dung.
2. **User Prompt (Khung chat trao đổi):** Nơi thầy cô ra lệnh bổ sung tính năng (ví dụ: *Thêm âm thanh khi trả lời đúng*, *Đổi tông màu sang xanh FPT*).
3. **Live Preview (Cửa sổ xem trước):** Nơi hiển thị trực tiếp Mini Webapp đang chạy để thầy cô trải nghiệm thử ngay lập tức.

### 2. Quy trình 3 bước thực hành chuẩn
* **Bước 1:** Mở tab **Tạo Prompt** trên Cổng Tập Huấn -> Điền thông tin bài học -> Bấm **Sao chép Prompt**.
* **Bước 2:** Mở Google AI Studio -> Chọn **Build mode** -> Dán Prompt vào **System Instructions**.
* **Bước 3:** Bấm nút **Run / Create App** -> Xem kết quả hiển thị ở khung Live Preview.
        `,
        codeSnippet: `// Ví dụ cấu trúc Master Prompt đơn giản:
Vai trò: Lập trình viên Front-end & Chuyên gia thiết kế game giáo dục FPT.
Bài học: Lịch sử 10 - Các cuộc cách mạng công nghiệp.
Yêu cầu: Tạo Mini Webapp Dòng thời gian tương tác có đếm ngược thời gian, âm thanh đúng/sai và bảng tổng kết điểm.`,
        keyTakeaways: [
          'Master Prompt đóng vai trò là "Bản thiết kế" quyết định 90% chất lượng của Webapp.',
          'Luôn chơi thử trên Live Preview từ màn hình Bắt đầu đến màn hình Tổng kết điểm.',
          'Tận dụng Trình tạo Prompt của Cổng Tập Huấn để không cần phải tự gõ prompt thủ công.'
        ]
      },
      {
        id: '1.3',
        title: 'Nguyên tắc bảo mật thông tin sư phạm',
        duration: '15 phút',
        summary: 'Các quy tắc an toàn dữ liệu, bảo vệ thông tin cá nhân của học sinh và tài sản trí tuệ của nhà trường.',
        contentMarkdown: `
### Nguyên tắc 3 KHÔNG khi ứng dụng AI trong trường học:
1. **KHÔNG** nhập danh sách thông tin cá nhân học sinh (Họ tên, ngày sinh, điểm số riêng tư, số điện thoại phụ huynh).
2. **KHÔNG** đưa đề thi bảo mật cấp trường/sở chưa công bố vào khung prompt công khai.
3. **KHÔNG** tải lên các tài liệu thuộc phạm vi bản quyền cấm chia sẻ ngoài nhà trường.

### Cam kết an toàn dữ liệu tại Cổng Tập Huấn FPT Bắc Giang
* Cổng Tập Huấn xử lý dữ liệu hoàn toàn **Client-side (Phía trình duyệt)**.
* Mọi thông tin bài giảng thầy cô nhập vào Form được lưu trữ cục bộ trên máy tính cá nhân, không tải lên máy chủ trung gian.
        `,
        keyTakeaways: [
          'Chỉ sử dụng dữ liệu bài giảng chuyên môn, tuyệt đối không nhập dữ liệu cá nhân học sinh.',
          'Cổng tập huấn xử lý an toàn trực tiếp trên trình duyệt của giáo viên.',
          'Master Prompt tạo ra hoàn toàn thuộc bản quyền sử dụng của thầy cô.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1.1',
        question: 'Điểm khác biệt cốt lõi giữa Build mode và Chat mode trong Google AI Studio là gì?',
        options: [
          'Build mode chỉ trả lời câu hỏi văn bản thuần túy.',
          'Build mode tự động lập trình và xuất bản Mini Webapp học tập chạy tương tác thật.',
          'Build mode dùng để chấm bài luận tự động.',
          'Build mode tự động xuất file PowerPoint.'
        ],
        correctAnswer: 1,
        explanation: 'Build mode tạo ra mã HTML/CSS/JS hoàn chỉnh để tạo thành ứng dụng web học tập chạy thật ngay trên trình duyệt.'
      },
      {
        id: 'q1.2',
        question: 'Dữ liệu giáo án thầy cô nhập vào Trình tạo Prompt tại Cổng Tập Huấn được xử lý như thế nào?',
        options: [
          'Lưu trữ công khai trên mạng xã hội.',
          'Lưu trên máy chủ nước ngoài.',
          'Xử lý an toàn hoàn toàn phía trình duyệt (Client-side) trên máy tính giáo viên.',
          'Tự động gửi cho toàn bộ học sinh.'
        ],
        correctAnswer: 2,
        explanation: 'Hệ thống thiết kế theo chuẩn mã nguồn Client-side, đảm bảo dữ liệu không bao giờ rời khỏi trình duyệt của thầy cô.'
      },
      {
        id: 'q1.3',
        question: 'Màn hình làm việc Build mode trong Google AI Studio gồm 3 khu vực chính nào?',
        options: [
          'Khung chat cá nhân, Danh bạ và Cài đặt tài khoản.',
          'System Instructions (Chỉ dẫn hệ thống), User Prompt (Khung chat) và Live Preview (Cửa sổ xem trước).',
          'Thư viện video, Kho giáo án và Bảng lương.',
          'Trình chiếu Slide, Bảng tính và Công cụ vẽ sơ đồ.'
        ],
        correctAnswer: 1,
        explanation: 'Giao diện Build mode gồm 3 khu vực: System Instructions dán Master Prompt, User Prompt trao đổi tinh chỉnh, và Live Preview xem trước webapp.'
      }
    ]
  },
  {
    id: 2,
    title: 'Mô-đun 2: Công thức Master Prompt Sư phạm',
    subtitle: 'Mổ xẻ cấu trúc Master Prompt & kỹ thuật "nạp" giáo án',
    description: 'Học cách biến các trường thông tin trong giáo án thành biến số chuẩn mực để AI tạo ra các Mini Webapp chuẩn sư phạm và thẩm mỹ cao.',
    icon: 'Cpu',
    lessons: [
      {
        id: '2.1',
        title: 'Mổ xẻ cấu trúc Master Prompt chuẩn',
        duration: '20 phút',
        summary: 'Phân tích 5 thành phần quan trọng bắt buộc phải có trong một Master Prompt sư phạm chất lượng cao.',
        contentMarkdown: `
### 5 Thành phần vàng trong Master Prompt Sư phạm:

1. **System Role (Vai trò hệ thống):** 
   \`\`\`text
   Bạn là chuyên gia thiết kế trải nghiệm học tập (EdTech UX) kiêm lập trình viên Front-end cao cấp tại FPT Education.
   \`\`\`
2. **Mandatory Task (Nhiệm vụ cốt lõi):** 
   Nêu rõ dạng trò chơi (Dòng thời gian, Trắc nghiệm, Lật thẻ, Ô chữ) và yêu cầu ứng dụng phải chạy mượt mà, không dùng button giả.
3. **Variables Context (Bối cảnh bài học):** 
   Truyền các biến số \`{subject}\`, \`{grade}\`, \`{lesson_name}\`, \`{objective}\`, \`{core_content}\`.
4. **UI/UX & Branding Standards (Chuẩn giao diện):** 
   Quy định màu sắc chủ đạo FPT Tech Blue (\`#0052CC\`), font chữ tiếng Việt \`Open Sans\`, giao diện sáng hiện đại, hỗ trợ Responsive trên điện thoại.
5. **Definition of Done (Tiêu chí hoàn thành):** 
   Chơi thử 1 lượt trọn vẹn: Màn hình Bắt đầu -> Câu hỏi tương tác -> Phản hồi đúng/sai + Âm thanh -> Bảng kết quả tổng điểm -> Nút Chơi lại.
        `,
        codeSnippet: `## CẤU TRÚC MASTER PROMPT CHUẨN (MẪU)
[ROLE]: Chuyên gia thiết kế game giáo dục FPT.
[CONTEXT]: Môn {subject} - Khối {grade} - Bài: {lesson_name}.
[TASK]: Tạo Mini Webapp dạng {game_type} gồm {question_count} câu hỏi.
[DESIGN]: Màu chủ đạo Tech Blue #0052CC, Font Open Sans, hỗ trợ Mobile.
[OUTPUT]: Mã nguồn HTML/CSS/JS chạy trực tiếp không lỗi.`,
        keyTakeaways: [
          'Master Prompt cần đầy đủ 5 thành phần để ngăn AI sáng tác lung tung.',
          'Quy định rõ màu sắc FPT Tech Blue và font Open Sans giúp giao diện chuyên nghiệp.',
          'Tiêu chí Definition of Done đảm bảo webapp có đầy đủ luồng chơi từ A đến Z.'
        ]
      },
      {
        id: '2.2',
        title: 'Cách "nạp" giáo án truyền thống vào Form',
        duration: '25 phút',
        summary: 'Hướng dẫn chuẩn hóa mục tiêu, kiến thức trọng tâm từ giáo án môn học thành dữ liệu đầu vào cho Prompt Builder.',
        contentMarkdown: `
### Quy tắc chuẩn hóa dữ liệu giáo án:

* **Tên bài học ({lesson_name}):** Nhập tên bài cụ thể kèm môn học (Ví dụ: *Lịch sử 10 - Bài 5: Văn minh Văn Lang - Âu Lạc*).
* **Nội dung cốt lõi ({core_content}):** Trình bày dưới dạng danh sách đánh số hoặc các mốc kiến thức rõ ràng:
  * *Mẫu chuẩn:*
    1. Năm 1764: James Hargreaves sáng chế ra máy kéo sợi Jenny.
    2. Năm 1784: James Watt hoàn thiện máy hơi nước.
        `,
        keyTakeaways: [
          'Trình bày dữ liệu theo mốc giúp AI trích xuất câu hỏi chính xác.',
          'Nội dung giáo án càng rõ ràng, sản phẩm Mini Webapp càng sát thực tế giảng dạy.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q2.1',
        question: 'Khi nạp nội dung cốt lõi vào Trình tạo Prompt, cách trình bày nào giúp AI trích xuất câu hỏi chuẩn nhất?',
        options: [
          'Chỉ ghi tiêu đề bài học chung chung.',
          'Liệt kê danh sách đánh số hoặc các mốc kiến thức cụ thể, rõ ràng.',
          'Copy cả cuốn sách giáo khoa vào ô văn bản.',
          'Để trống không nhập nội dung.'
        ],
        correctAnswer: 1,
        explanation: 'Trình bày dạng danh sách đánh số hoặc mốc lịch sử rõ ràng giúp AI hiểu đúng trọng tâm và đặt câu hỏi chính xác.'
      },
      {
        id: 'q2.2',
        question: 'Master Prompt Sư phạm chuẩn bao gồm mấy thành phần cốt lõi?',
        options: [
          'Chỉ 1 thành phần là Tên bài học.',
          '3 thành phần ngẫu nhiên.',
          '5 thành phần vàng: System Role, Mandatory Task, Variables Context, UI/UX Branding và Definition of Done.',
          'Không cần thành phần nào.'
        ],
        correctAnswer: 2,
        explanation: 'Master Prompt sư phạm đầy đủ 5 thành phần giúp AI tạo ứng dụng chuẩn xác, thẩm mỹ FPT và không bị phát sinh lỗi.'
      },
      {
        id: 'q2.3',
        question: 'Thầy cô nên làm gì khi nút bấm hoặc tính năng trên Mini Webapp gặp sự cố không phản hồi?',
        options: [
          'Tạo lại toàn bộ ứng dụng từ đầu.',
          'Bỏ không sử dụng nữa.',
          'Sử dụng câu lệnh tinh chỉnh (Follow-up Prompt) mô tả cụ thể vị trí lỗi để AI kiểm tra và sửa lại mã nguồn.',
          'Tắt máy tính.'
        ],
        correctAnswer: 2,
        explanation: 'Chỉ cần gửi câu lệnh mô tả đúng vị trí nút/màn hình bị lỗi trong khung chat, AI sẽ nhanh chóng sửa mã nguồn mà không cần tạo lại từ đầu.'
      }
    ]
  },
  {
    id: 3,
    title: 'Mô-đun 3: Thực chiến & Xuất bản Webapp',
    subtitle: 'Thực hành case study & quy trình chia sẻ sản phẩm',
    description: 'Khám phá các dạng bài tập thực chiến (Trắc nghiệm Dòng thời gian, Ô chữ, Ghép đôi) và cách xuất bản link cho học sinh trải nghiệm.',
    icon: 'Trophy',
    lessons: [
      {
        id: '3.1',
        title: 'Case Study: Các dạng Game học tập thực chiến',
        duration: '25 phút',
        summary: 'Phân tích hiệu quả và phạm vi ứng dụng của 4 dạng game tương tác phổ biến trong giảng dạy.',
        contentMarkdown: `
### 4 Dạng Mini Webapp học tập tiêu biểu:

1. **Dạng 1: Trắc nghiệm Dòng thời gian (Timeline Game)**
   * *Môn học áp dụng:* Lịch sử, Ngữ văn (diễn biến tác phẩm), Khoa học (các bước thí nghiệm), Tiếng Anh (tiến trình sự kiện).
   * *Ưu điểm:* Giúp học sinh hình dung trực quan về thứ tự thời gian và mối quan hệ nguyên nhân - kết quả.

2. **Dạng 2: Game Trắc nghiệm tính điểm & Âm thanh (Quiz Master)**
   * *Môn học áp dụng:* Toán, Lý, Hóa, Sinh, Địa lý.
   * *Ưu điểm:* Nhịp độ nhanh, hiệu ứng âm thanh cổ vũ khi chọn đúng giúp tăng sự hào hứng.

3. **Dạng 3: Lật thẻ ghi nhớ (Flashcard Memory)**
   * *Môn học áp dụng:* Ngoại ngữ (Từ vựng), Sinh học (Thuật ngữ), Hóa học (Ký hiệu nguyên tố).
   * *Ưu điểm:* Rèn luyện trí nhớ ngắn hạn và phản xạ nhanh.

4. **Dạng 4: Ô chữ kiến thức (Crossword Puzzle)**
   * *Môn học áp dụng:* Ôn tập tổng hợp cuối chương/cuối học kỳ.
   * *Ưu điểm:* Thử thách tư duy logic và khả năng tổng hợp kiến thức.
        `,
        keyTakeaways: [
          'Mỗi môn học có dạng trò chơi tương thích tối ưu riêng.',
          'Dạng Dòng thời gian rất mạnh cho các môn có tính trình tự diễn biến.',
          'Thầy cô có thể thay đổi dạng game linh hoạt ngay trong Trình tạo Prompt.'
        ]
      },
      {
        id: '3.2',
        title: 'Quy trình 3 bước Kiểm thử & Chia sẻ Link',
        duration: '20 phút',
        summary: 'Hướng dẫn kiểm thử sản phẩm, kiểm tra tính tương thích di động và xuất bản link gửi cho học sinh.',
        contentMarkdown: `
### Quy trình 3 bước bàn giao sản phẩm Webapp chuẩn:

1. **Bước 1: Chơi thử trọn vẹn (Test Run)**
   * Thầy cô bấm nút **Bắt đầu** -> Trả lời thử cả câu đúng và sai -> Kiểm tra xem điểm số có cộng đúng không -> Bấm **Chơi lại** để đảm bảo reset điểm về 0.

2. **Bước 2: Kiểm tra Responsive trên điện thoại**
   * Thu nhỏ cửa sổ trình duyệt hoặc mở bằng điện thoại di động để đảm bảo các nút bấm to, rõ ràng (tối thiểu 44px) và chữ không bị tràn màn hình.

3. **Bước 3: Xuất bản & Chia sẻ (Deploy & Share)**
   * Bấm nút **Share / Deploy** ở góc phải giao diện Google AI Studio.
   * Sao chép đường link ứng dụng -> Gửi vào nhóm Zalo lớp / Hệ thống LMS / Mã QR chiếu trên màn hình lớp học.
        `,
        keyTakeaways: [
          'Luôn chơi thử 1 lượt trọn vẹn từ đầu đến cuối trước khi gửi link cho học sinh.',
          'Đảm bảo nút bấm hiển thị mượt mà trên điện thoại di động.',
          'Học sinh mở link trực tiếp trên mọi trình duyệt mà không cần đăng nhập hay cài ứng dụng.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q3.1',
        question: 'Thao tác đầu tiên thầy cô cần thực hiện ngay sau khi Google AI Studio tạo xong Webapp là gì?',
        options: [
          'Gửi link ngay lập tức cho phụ huynh.',
          'Chơi thử trọn vẹn 1 lượt từ màn hình Bắt đầu đến màn hình Kết quả để kiểm tra luồng chạy.',
          'Đổi ngay sang bài học khác.',
          'Tắt trình duyệt.'
        ],
        correctAnswer: 1,
        explanation: 'Luôn chơi thử 1 lượt trọn vẹn để đảm bảo không có nút bị lỗi hay tính năng đếm điểm bị gián đoạn.'
      },
      {
        id: 'q3.2',
        question: 'Học sinh sẽ trải nghiệm Mini Webapp do thầy cô tạo ra bằng cách nào?',
        options: [
          'Phải cài ứng dụng phức tạp trên cửa hàng ứng dụng.',
          'Phải tạo tài khoản lập trình viên và đăng nhập Google AI Studio.',
          'Mở trực tiếp đường link hoặc quét mã QR do thầy cô chia sẻ trên mọi trình duyệt mà không cần đăng nhập.',
          'Phải trả phí hàng tháng.'
        ],
        correctAnswer: 2,
        explanation: 'Học sinh chỉ cần mở đường link hoặc quét mã QR là có thể làm bài/chơi game học tập trực tiếp ngay trên trình duyệt.'
      },
      {
        id: 'q3.3',
        question: 'Số lượng thử thách/câu hỏi tối ưu khuyến nghị cho một lượt chơi khởi động hoặc ôn tập là bao nhiêu?',
        options: [
          'Từ 5 đến 8 câu hỏi để đảm bảo nhịp độ sôi nổi và vừa vặn thời lượng lớp học.',
          'Tối thiểu 50 câu hỏi.',
          'Duy nhất 1 câu hỏi.',
          'Từ 100 đến 200 câu.'
        ],
        correctAnswer: 0,
        explanation: 'Số lượng 5 - 8 câu hỏi giúp duy trì nhịp độ sôi nổi, vừa vặn thời lượng 10-15 phút khởi động hoặc ôn tập.'
      }
    ]
  }
];
