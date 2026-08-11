import { PromptVariables, GAME_TYPES, CustomWebappIdea } from '../types';

export function getGameTypeLabel(gameTypeId?: string): string {
  const found = GAME_TYPES.find(g => g.id === gameTypeId);
  return found ? `${found.title} (${found.subtitle})` : 'Dòng thời gian (Sắp xếp sự kiện)';
}

export function generateCustomWebappMasterPrompt(idea: CustomWebappIdea): string {
  const productName = idea.productName && idea.productName.trim() ? idea.productName.trim() : 'Chưa đặt tên';
  
  const targetAudience = idea.targetAudience && idea.targetAudience.trim() ? idea.targetAudience.trim() : 'Học sinh';
  
  const problem = idea.problem && idea.problem.trim() ? idea.problem.trim() : 'Chưa mô tả cụ thể';
  
  const demandSentence = idea.demandSentence && idea.demandSentence.trim()
    ? idea.demandSentence.trim()
    : `Tôi cần một webapp giúp ${targetAudience} ${idea.supportTask || 'thực hành và làm bài tập'} để ${idea.desiredOutcome || 'đạt kết quả ôn tập tốt'}.`;

  const objective = idea.objective && idea.objective.trim() ? idea.objective.trim() : demandSentence;

  // Build Content/Data section
  const contentParts: string[] = [];
  if (idea.contentData && idea.contentData.trim()) {
    contentParts.push(idea.contentData.trim());
  } else if (idea.mandatoryContent && idea.mandatoryContent.trim()) {
    contentParts.push(idea.mandatoryContent.trim());
  } else {
    contentParts.push('Nội dung, bài tập hoặc câu hỏi do giáo viên/người dùng cung cấp.');
  }

  if (idea.contentOptions && idea.contentOptions.length > 0) {
    contentParts.push('\nTùy chọn xử lý nội dung:');
    idea.contentOptions.forEach(opt => contentParts.push(`- ${opt}`));
  }

  const contentText = contentParts.join('\n');

  // Build Functions list
  const validFunctions = idea.functions ? idea.functions.filter(f => f.trim() !== '') : [];
  const functionsText = validFunctions.length > 0
    ? validFunctions.map((f, i) => `${i + 1}. ${f.trim()}`).join('\n')
    : '1. Hiển thị nội dung chính\n2. Cho phép người dùng tương tác\n3. Hiển thị kết quả và phản hồi';

  // Build User Flow
  let userFlowText = '';
  if (idea.userFlowSteps && idea.userFlowSteps.filter(s => s.trim() !== '').length > 0) {
    userFlowText = idea.userFlowSteps.filter(s => s.trim() !== '').map(s => s.trim()).join(' → ');
  } else if (idea.userFlow && idea.userFlow.trim()) {
    userFlowText = idea.userFlow.trim();
  } else {
    userFlowText = 'Mở webapp → Chọn chủ đề → Làm bài tập → Nhận phản hồi → Xem kết quả';
  }

  // Expected Output
  const expectedOutput = idea.expectedOutput && idea.expectedOutput.trim()
    ? idea.expectedOutput.trim()
    : 'Kết quả tương tác, điểm số hoặc phản hồi hướng dẫn cho người dùng.';

  // UI styling notes
  const uiStyles = idea.uiStyle && idea.uiStyle.length > 0 ? idea.uiStyle.join(', ') : '';
  const uiCombined = idea.otherUiReqs ? `${uiStyles ? uiStyles + '. ' : ''}${idea.otherUiReqs}` : uiStyles;

  // Constraints
  const constraintsList: string[] = [];
  if (idea.constraints && idea.constraints.length > 0) {
    idea.constraints.forEach(c => constraintsList.push(`- ${c}`));
  } else {
    constraintsList.push('- Sử dụng tiếng Việt');
    constraintsList.push('- Responsive trên máy tính và điện thoại');
    constraintsList.push('- Không yêu cầu đăng nhập');
    constraintsList.push('- Không sử dụng database');
    constraintsList.push('- Không thu thập thông tin cá nhân');
  }

  if (idea.otherConstraints && idea.otherConstraints.trim()) {
    constraintsList.push(`- ${idea.otherConstraints.trim()}`);
  }

  const constraintsText = constraintsList.join('\n');

  return `Bạn là chuyên gia thiết kế và phát triển webapp.

Hãy xây dựng một webapp theo Requirements sau:

TÊN SẢN PHẨM:
${productName}

BỐI CẢNH:
${problem}

NGƯỜI DÙNG:
${targetAudience}

VẤN ĐỀ:
${problem}

MỤC TIÊU:
${objective}

NỘI DUNG / DỮ LIỆU:
${contentText}

CHỨC NĂNG:
${functionsText}

LUỒNG SỬ DỤNG:
${userFlowText}

ĐẦU RA:
${expectedOutput}

YÊU CẦU GIAO DIỆN:
- Đơn giản
- Trực quan
- Responsive
- Phù hợp với đối tượng người dùng${uiCombined ? `\n- Phong cách/Chi tiết khác: ${uiCombined}` : ''}

RÀNG BUỘC:
${constraintsText}

XỬ LÝ TRƯỜNG HỢP LỖI:
- Không crash khi dữ liệu trống.
- Thông báo rõ nếu dữ liệu không hợp lệ.
- Không tự tạo dữ liệu ngoài nguồn cho phép.

TIÊU CHÍ KIỂM THỬ:
- Luồng chính phải hoạt động đầy đủ.
- Các chức năng chính phải hoạt động đúng.
- Responsive trên desktop và mobile.
- Không làm mất dữ liệu khi người dùng thao tác.
- Không tự ý bổ sung chức năng ngoài Requirements.

Hãy ưu tiên xây dựng phiên bản hoạt động đúng chức năng trước.

Không tự ý thêm chức năng ngoài Requirements.

Nếu có điểm chưa rõ ảnh hưởng trực tiếp đến việc xây dựng sản phẩm, hãy hỏi lại trước khi tự đưa ra giả định.`;
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
