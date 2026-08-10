import { MiniAppQuestion } from '../types';

export const SAMPLE_SANDBOX_QUESTIONS: MiniAppQuestion[] = [
  {
    id: 1,
    yearOrEvent: 'Năm 1764',
    question: 'Phát minh nào khởi đầu cho ngành công nghiệp dệt trong Cuộc cách mạng công nghiệp lần thứ nhất?',
    options: [
      'Máy kéo sợi Jenny do James Hargreaves sáng chế',
      'Động cơ hơi nước của James Watt',
      'Đầu máy xe lửa Stephenson',
      'Tàu thủy chạy bằng hơi nước Fulton'
    ],
    correctAnswer: 0,
    explanation: 'Năm 1764, James Hargreaves sáng chế ra máy kéo sợi Jenny, tăng năng suất kéo sợi lên gấp 8 lần và mở đầu cho sự phát triển của công nghiệp dệt.'
  },
  {
    id: 2,
    yearOrEvent: 'Năm 1769',
    question: 'Phát minh mang tính quyết định tạo nên bước ngoặt chuyển từ lao động thủ công sang cơ khí hóa là gì?',
    options: [
      'Bóng đèn sợi đốt Edison',
      'Máy gặt đập liên hợp',
      'Động cơ hơi nước do James Watt phát minh & hoàn thiện',
      'Dây chuyền lắp ráp tự động'
    ],
    correctAnswer: 2,
    explanation: 'Năm 1769, James Watt phát minh ra động cơ hơi nước, cung cấp nguồn năng lượng cơ khí vạn năng cho các nhà máy và ngành giao thông vận tải.'
  },
  {
    id: 3,
    yearOrEvent: 'Năm 1807 - 1814',
    question: 'Cuộc cách mạng công nghiệp 1.0 đã làm thay đổi ngành giao thông vận tải như thế nào?',
    options: [
      'Sáng chế ra máy bay phản lực thương mại',
      'Xuất hiện Tàu thủy hơi nước (1807) và Đầu máy xe lửa chạy bằng hơi nước (1814)',
      'Sản xuất xe ô tô chạy bằng năng lượng điện',
      'Xây dựng hệ thống tàu điện ngầm siêu tốc'
    ],
    correctAnswer: 1,
    explanation: 'Năm 1807, Robert Fulton chế tạo tàu thủy hơi nước. Năm 1814, Stephenson chế tạo thành công đầu máy xe lửa, mở ra kỷ nguyên đường sắt.'
  },
  {
    id: 4,
    yearOrEvent: 'Thế kỷ XIX - XX',
    question: 'Yếu tố năng lượng chính đánh dấu sự khởi đầu của Cuộc cách mạng công nghiệp lần thứ hai (CMCN 2.0) là gì?',
    options: [
      'Năng lượng than đá',
      'Năng lượng gió & Mặt trời',
      'Điện năng và Động cơ đốt trong',
      'Năng lượng nguyên tử'
    ],
    correctAnswer: 2,
    explanation: 'CMCN 2.0 gắn liền với sự phát minh ra Điện năng, Động cơ đốt trong và dây chuyền sản xuất hàng loạt (Fordism).'
  },
  {
    id: 5,
    yearOrEvent: 'Kỷ nguyên 4.0',
    question: 'Đặc trưng nổi bật nhất của Cuộc cách mạng công nghiệp lần thứ tư (CMCN 4.0) ngày nay là gì?',
    options: [
      'Sử dụng động cơ hơi nước',
      'Trí tuệ nhân tạo (AI), Internet vạn vật (IoT) và Điện toán đám mây',
      'Chỉ phát triển công nghiệp hóa chất',
      'Sản xuất thủ công truyền thống'
    ],
    correctAnswer: 1,
    explanation: 'CMCN 4.0 là sự kết hợp giữa hệ thống vật lý và không gian mạng dựa trên AI, Big Data, IoT và tự động hóa thông minh.'
  }
];
