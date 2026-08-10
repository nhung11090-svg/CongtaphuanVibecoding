import { PromptVariables, GAME_TYPES, CustomWebappIdea } from '../types';

export function getGameTypeLabel(gameTypeId?: string): string {
  const found = GAME_TYPES.find(g => g.id === gameTypeId);
  return found ? `${found.title} (${found.subtitle})` : 'Dòng thời gian (Sắp xếp sự kiện)';
}

export function generateCustomWebappMasterPrompt(idea: CustomWebappIdea): string {
  const functionsList = idea.functions && idea.functions.filter(f => f.trim() !== '').length > 0
    ? idea.functions.filter(f => f.trim() !== '').map((f, i) => `${i + 1}. ${f}`).join('\n')
    : '1. Hiển thị thông tin chính\n2. Cho phép người dùng tương tác\n3. Hiển thị kết quả và phản hồi';

  const uiStyles = idea.uiStyle && idea.uiStyle.length > 0 ? idea.uiStyle.join(', ') : 'Đơn giản, Hiện đại';
  const uiCombined = idea.otherUiReqs ? `${uiStyles}. ${idea.otherUiReqs}` : uiStyles;

  const constraintsList = idea.constraints && idea.constraints.length > 0
    ? idea.constraints.map(c => `- ${c}`).join('\n')
    : '- Hoạt động ổn định, không yêu cầu đăng nhập\n- Nội dung hoàn toàn bằng tiếng Việt\n- Sử dụng được trên máy tính và điện thoại';

  return `VAI TRÒ
Bạn là chuyên gia thiết kế ứng dụng web và trải nghiệm người dùng trong giáo dục.

BỐI CẢNH
${idea.problem || 'Cần xây dựng một ứng dụng web phục vụ giảng dạy và hỗ trợ công việc thực tế.'}

ĐỐI TƯỢNG SỬ DỤNG
${idea.targetAudience || 'Học sinh phổ thông và Giáo viên'}

MỤC TIÊU CỦA ỨNG DỤNG
Từ vấn đề đã mô tả, ứng dụng web phải giúp người dùng giải quyết triệt để khó khăn: "${idea.problem || 'Thao tác và học tập hiệu quả'}", mang lại trải nghiệm trực quan, dễ dùng và đạt hiệu quả thiết thực.

CHỨC NĂNG CHÍNH
${functionsList}

LUỒNG SỬ DỤNG
${idea.userFlow || 'Mở trang → Đọc hướng dẫn → Thực hiện nhiệm vụ → Nhận phản hồi → Xem kết quả → Chơi lại / Làm lại.'}

NỘI DUNG BẮT BUỘC
${idea.mandatoryContent || 'Sử dụng các nội dung do giáo viên cung cấp.'}

YÊU CẦU GIAO DIỆN
- Phong cách: ${uiCombined}
- Bố cục rõ ràng, trực quan, màu sắc phù hợp, phông chữ dễ đọc.

RÀNG BUỘC
${constraintsList}

YÊU CẦU TRẢI NGHIỆM
- Giao diện rõ ràng.
- Responsive.
- Sử dụng tốt trên máy tính và điện thoại.
- Các nút bấm dễ nhận biết.
- Có hướng dẫn sử dụng ngắn gọn.
- Không để thông tin quan trọng bị che hoặc tràn màn hình.

YÊU CẦU KỸ THUẬT
- Tạo một webapp hoạt động được.
- Ưu tiên giải pháp đơn giản và ổn định.
- Không tự thêm các chức năng phức tạp không được yêu cầu.
- Nếu không cần thiết, không sử dụng backend hoặc cơ sở dữ liệu.
- Không thu thập thông tin cá nhân nếu người dùng không yêu cầu.

YÊU CẦU KIỂM THỬ
Sau khi tạo ứng dụng:
1. Kiểm tra toàn bộ các nút.
2. Kiểm tra luồng chính.
3. Kiểm tra nội dung.
4. Kiểm tra hiển thị trên màn hình nhỏ.
5. Bảo đảm chức năng chính hoạt động.

NGUYÊN TẮC QUAN TRỌNG
Không tự ý thay đổi nội dung chuyên môn do giáo viên cung cấp.
Nếu một yêu cầu chưa rõ, ưu tiên cách triển khai đơn giản và dễ sử dụng.

Hãy tạo phiên bản đầu tiên của ứng dụng.`;
}

export function generateMasterPrompt(vars: PromptVariables): string {
  const subject = vars.subject || 'Chưa nhập môn học';
  const grade = vars.grade || 'Chưa nhập khối lớp';
  const lesson_name = vars.lesson_name || 'Chưa nhập tên bài';
  const objective = vars.objective || 'Chưa nhập mục tiêu';
  const core_content = vars.core_content || 'Chưa nhập nội dung cốt lõi';
  const keywords = vars.keywords || 'Chưa nhập từ khóa';
  const question_count = vars.question_count || '5';
  const duration = vars.duration || '15 phút';
  const gameTypeLabel = getGameTypeLabel(vars.game_type);

  return `Bạn là chuyên gia thiết kế trải nghiệm học tập và lập trình viên front-end cao cấp.

## Nhiệm vụ bắt buộc
Hãy xây dựng một MINI WEBAPP học tập hoàn chỉnh trong Google AI Studio Build mode dành cho học sinh. Mini webapp này sử dụng hình thức **${gameTypeLabel}** làm trải nghiệm tương tác chính, là một sản phẩm web có giao diện, màn hình, trạng thái và tương tác chạy thật — không chỉ là một đoạn code minh họa hay mockup tĩnh.

## Bối cảnh bài học & Đơn vị
- Đơn vị: Trường Tiểu học, THCS & THPT FPT Bắc Giang
- Khẩu hiệu: Trải nghiệm để trưởng thành!
- Môn học: ${subject}
- Khối lớp: ${grade}
- Tên bài học: ${lesson_name}
- Hình thức trò chơi: ${gameTypeLabel}
- Mục tiêu bài học: ${objective}
- Nội dung cốt lõi: ${core_content}
- Từ khóa chính: ${keywords}
- Số lượng câu hỏi/thử thách: ${question_count}
- Thời lượng thiết kế: ${duration}

## Cấu trúc Mini Webapp
1. Màn hình Mở đầu (Welcome): Tên bài học, biểu tượng chủ đề, mục tiêu ngắn gọn và nút "Bắt đầu trải nghiệm".
2. Màn hình Hướng dẫn: 2–3 bước hướng dẫn cách chơi trò **${gameTypeLabel}**.
3. Màn hình Trò chơi chính (${gameTypeLabel}):
   - Hiển thị nội dung câu hỏi/thử thách chuẩn xác bám sát nội dung bài học.
   - Thanh tiến độ, điểm số thực tế, đồng hồ đếm ngược (nếu có).
   - Phản hồi đúng/sai tức thì kèm lời giải thích giáo dục chi tiết.
4. Màn hình Hoàn thành (Result): Tong điểm, xếp loại, lời khen mang tinh thần FPT Bắc Giang "Trải nghiệm để trưởng thành!", nút "Chơi lại" và "Xem đáp án".

## Trải nghiệm & Giao diện
- Phong cách: Tươi sáng, hiện đại, màu sắc chủ đạo xanh cam năng động (FPT Education).
- Ngôn ngữ: Tiếng Việt chuẩn mực, xưng hô thân thiện phù hợp học sinh ${grade}.
- Responsive: Tối ưu hoàn hảo trên Điện thoại, Máy tính bảng và Laptop.
- Âm thanh: Có âm thanh chúc mừng/phản hồi (sử dụng Web Audio API không phụ thuộc file ngoài) và nút bật/tắt âm thanh.

## Yêu cầu kỹ thuật & Bàn giao
- Tạo toàn bộ ứng dụng chạy trực tiếp trong Google AI Studio Build mode (HTML, CSS, JavaScript/React).
- Dữ liệu bài học (mảng câu hỏi/thử thách) đặt ở phần đầu file, có chú thích rõ ràng bằng tiếng Việt để giáo viên dễ dàng tự chỉnh sửa câu hỏi.
- Bàn giao sản phẩm chạy được ngay, cho phép kiểm thử trọn vẹn từ Mở đầu -> Chơi game -> Tổng kết -> Chơi lại.`;
}
