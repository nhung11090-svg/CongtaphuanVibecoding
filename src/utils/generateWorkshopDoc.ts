import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
} from 'docx';

export async function generateWorkshopDoc(): Promise<Blob> {
  // Brand color palette
  const PRIMARY_COLOR = '0052CC'; // FPT Tech Blue
  const SECONDARY_COLOR = 'D97706'; // Amber / Orange
  const TEXT_DARK = '1A202C';
  const BG_LIGHT = 'F8FAFC';
  const BORDER_COLOR = 'CBD5E1';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'TÀI LIỆU BÀI GIẢNG CHI TIẾT • FPT SCHOOL BẮC GIANG',
                    size: 16,
                    color: '64748B',
                    font: 'Open Sans',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Nội dung chi tiết bài giảng tập huấn Google AI Studio — Trang ',
                    size: 18,
                    color: '64748B',
                    font: 'Open Sans',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '64748B',
                    font: 'Open Sans',
                  }),
                  new TextRun({
                    text: ' / ',
                    size: 18,
                    color: '64748B',
                    font: 'Open Sans',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '64748B',
                    font: 'Open Sans',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Header Org Info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'TRƯỜNG TIỂU HỌC, THCS & THPT FPT BẮC GIANG',
                bold: true,
                size: 22,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'TỔ STEM, TIN HỌC VÀ CÔNG NGHỆ',
                bold: true,
                size: 20,
                color: '475569',
                font: 'Open Sans',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '*** Khẩu hiệu: Trải nghiệm để trưởng thành! ***',
                italics: true,
                size: 18,
                color: SECONDARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),

          // Divider Line
          new Paragraph({
            border: {
              bottom: {
                color: PRIMARY_COLOR,
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12,
              },
            },
            spacing: { after: 300 },
          }),

          // Document Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: 'NỘI DUNG CHI TIẾT BÀI GIẢNG TẬP HUẤN',
                bold: true,
                size: 30,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ỨNG DỤNG GOOGLE AI STUDIO VÀ SÁNG TẠO MINI WEBAPP TRONG GIẢI HỌC & ÔN TẬP TƯƠNG TÁC',
                bold: true,
                size: 22,
                color: TEXT_DARK,
                font: 'Open Sans',
              }),
            ],
          }),

          // Info Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F1F5F9' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
                      bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
                      left: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
                      right: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 80, after: 40 },
                        children: [
                          new TextRun({ text: '• Môn/Chủ đề: ', bold: true, size: 20, font: 'Open Sans' }),
                          new TextRun({ text: 'Chuyển đổi số & Ứng dụng AI trong Giảng dạy chuyên môn', size: 20, font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 40, after: 40 },
                        children: [
                          new TextRun({ text: '• Đối tượng bồi dưỡng: ', bold: true, size: 20, font: 'Open Sans' }),
                          new TextRun({ text: 'Toàn thể Cán bộ Giáo viên các cấp Tiểu học, THCS, THPT FPT Bắc Giang', size: 20, font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 40, after: 40 },
                        children: [
                          new TextRun({ text: '• Thời lượng bài giảng: ', bold: true, size: 20, font: 'Open Sans' }),
                          new TextRun({ text: '03 Mô-đun lý thuyết & thực hành (Tổng 210 phút)', size: 20, font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 40, after: 80 },
                        children: [
                          new TextRun({ text: '• Tác giả biên soạn: ', bold: true, size: 20, font: 'Open Sans' }),
                          new TextRun({ text: 'TGV. Trần Thị Nhung — Tổ STEM, Tin học và Công nghệ', size: 20, font: 'Open Sans' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 1
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: 'MÔ-ĐUN 1: NỀN TẢNG GOOGLE AI STUDIO & MÔI TRƯỜNG BUILD MODE',
                bold: true,
                size: 24,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),

          // Lesson 1.1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 1.1: Giới thiệu Google AI Studio (Thời lượng: 15 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '1. Đặt vấn đề & Lời giảng của Giảng viên:', bold: true, size: 20, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'Thưa thầy cô, trong kỷ nguyên số hóa giáo dục, học sinh FPT rất hào hứng với các hoạt động mang tính tương tác trực quan. Google AI Studio là môi trường lập trình trí tuệ nhân tạo thế hệ mới của Google (sử dụng dòng mô hình Gemini). Điểm khác biệt quan trọng nhất là công cụ này cung cấp chế độ Build mode — cho phép tự động chuyển đổi mô tả ý tưởng bằng văn bản thành ứng dụng web hoạt động thực tế (Mini Webapp) mà giáo viên không cần viết bất kỳ dòng code nào.',
                size: 20,
                font: 'Open Sans',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '2. Bảng so sánh chuyên sâu Chat mode và Build mode:', bold: true, size: 20, font: 'Open Sans' }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Tiêu chí so sánh', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Chat mode (Trò chuyện)', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Build mode (Xây dựng Webapp)', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dạng kết quả đầu ra', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Văn bản thuần túy, danh sách câu hỏi, đoạn tóm tắt', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Một Mini Webapp hoàn chỉnh (HTML/CSS/JS chạy trực tiếp)', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Mức độ tương tác', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Học sinh đọc văn bản bị động', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Học sinh chủ động bấm nút, nghe âm thanh, xem điểm số', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ứng dụng dạy học', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Soạn giáo án, làm đáp án đề thi', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Game khởi động đầu giờ, Game ôn tập, Bài tập về nhà', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
            ],
          }),

          // Lesson 1.2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 1.2: Làm quen môi trường Build mode (Thời lượng: 20 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Cấu trúc 3 khu vực làm việc trong Google AI Studio:', bold: true, size: 20, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Khu vực 1 - System Instructions: ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Nơi dán Master Prompt (Bản thiết kế kỹ thuật) định hình luật chơi và bối cảnh môn học.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Khu vực 2 - User Prompt (Chat Log): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Nơi trao đổi, ra lệnh bổ sung tính năng hoặc điều chỉnh màu sắc, font chữ.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Khu vực 3 - Live Preview: ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Khung hiển thị sản phẩm webapp đang chạy thật để thầy cô trải nghiệm trực tiếp.', size: 20, font: 'Open Sans' })] }),

          // Lesson 1.3
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 1.3: Nguyên tắc bảo mật thông tin sư phạm (Thời lượng: 15 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Quy tắc 3 KHÔNG bắt buộc tuân thủ:', bold: true, size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '1. KHÔNG nhập thông tin định danh cá nhân học sinh (Họ tên đầy đủ, ngày sinh, điểm số riêng tư).', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '2. KHÔNG upload các đề thi bảo mật chưa công bố.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '3. KHÔNG sử dụng tài liệu thuộc bản quyền bị cấm chia sẻ ngoài nhà trường.', size: 20, font: 'Open Sans' })] }),

          // Section 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: 'MÔ-ĐUN 2: CÔNG THỨC MASTER PROMPT SƯ PHẠM CHUẨN GOOGLE AI STUDIO',
                bold: true,
                size: 24,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),

          // Lesson 2.1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 2.1: Mổ xẻ cấu trúc 5 thành phần Master Prompt (Thời lượng: 20 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Thành phần 1 - System Role (Vai trò): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Chuyên gia thiết kế game giáo dục FPT kiêm Lập trình viên Front-end.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Thành phần 2 - Mandatory Task (Nhiệm vụ): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Tạo Mini Webapp tương tác có điểm số, âm thanh, hỗ trợ tiếng Việt.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Thành phần 3 - Variables Context (Bối cảnh): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Truyền thông số Môn học, Lớp, Tên bài, Mục tiêu và Nội dung cốt lõi.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Thành phần 4 - Branding Standards (Chuẩn FPT): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Màu xanh Tech Blue (#0052CC), Font Open Sans, bo góc hiện đại.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Thành phần 5 - Definition of Done (Tiêu chí): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Đảm bảo luồng chơi đầy đủ từ Màn hình Bắt đầu -> Câu hỏi -> Tổng kết -> Bấm chơi lại.', size: 20, font: 'Open Sans' })] }),

          // Master Prompt Template Code Block
          new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: 'MẪU PROMPT CHUẨN MỰC SAO CHÉP (MASTER PROMPT TEMPLATE):', bold: true, size: 20, color: PRIMARY_COLOR, font: 'Open Sans' })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F8FAFC' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR },
                      bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR },
                      left: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR },
                      right: { style: BorderStyle.SINGLE, size: 6, color: BORDER_COLOR },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `[ROLE]: Bạn là chuyên gia thiết kế game giáo dục FPT kiêm Lập trình viên Web.
[TASK]: Hãy tạo 01 Mini Webapp học tập tương tác chạy Client-side 100%.
[CONTEXT]:
- Môn học: {subject}
- Lớp: {grade}
- Tên bài học: {lesson_name}
- Mục tiêu bài học: {objective}
- Nội dung cốt lõi: {core_content}
[DESIGN]: Sử dụng tông màu FPT Tech Blue #0052CC, Font chữ 'Open Sans', giao diện tươi sáng, hiện đại, hỗ trợ hiển thị đẹp trên điện thoại di động.
[OUTPUT]: Mã HTML/CSS/JS chạy trực tiếp không lỗi.`,
                            size: 18,
                            font: 'Open Sans',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Lesson 2.2 & 2.3
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 2.2 & 2.3: Kỹ thuật nạp giáo án & Xử lý sự cố (Thời lượng: 45 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Các câu lệnh xử lý sự cố đút túi cho giáo viên:', bold: true, size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '• Khi nút bấm bị liệt/không phản hồi: ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: '"Nút Bắt đầu đang bị đơ. Hãy kiểm tra lại sự kiện click trong JavaScript và ẩn màn hình Welcome."', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '• Khi font chữ bị lỗi tiếng Việt: ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: '"Thêm Google Fonts Open Sans vào head và cập nhật CSS font-family: Open Sans, sans-serif."', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: '• Khi muốn đồng bộ màu FPT: ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: '"Cập nhật giao diện sang màu chủ đạo Tech Blue #0052CC và màu phụ #0A66C2."', size: 20, font: 'Open Sans' })] }),

          // Section 3
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: 'MÔ-ĐUN 3: THỰC CHIẾN SÁNG TẠO MINI WEBAPP & XUẤT BẢN',
                bold: true,
                size: 24,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),

          // Lesson 3.1 & 3.2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'Bài 3.1 & 3.2: Thực hành tạo Webapp & Quy trình xuất bản link (Thời lượng: 45 phút)', bold: true, size: 22, color: SECONDARY_COLOR, font: 'Open Sans' }),
            ],
          }),
          new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'Quy trình 3 bước kiểm thử & xuất bản link cho học sinh:', bold: true, size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Bước 1 (Test Run): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Giáo viên bấm Bắt đầu -> Trả lời thử cả câu đúng và sai -> Kiểm tra tính điểm -> Bấm Chơi lại.', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Bước 2 (Responsive Check): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Thu nhỏ cửa sổ trình duyệt hoặc mở điện thoại để đảm bảo nút bấm to rõ (>= 44px).', size: 20, font: 'Open Sans' })] }),
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: 'Bước 3 (Share Link): ', bold: true, size: 20, font: 'Open Sans' }), new TextRun({ text: 'Bấm nút Share / Deploy ở góc phải Google AI Studio -> Sao chép link gửi vào nhóm Zalo lớp / LMS.', size: 20, font: 'Open Sans' })] }),

          // Section 4 Rubric
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({
                text: 'BẢNG TIÊU CHÍ ĐÁNH GIÁ SẢN PHẨM SÁNG TẠO (RUBRIC)',
                bold: true,
                size: 24,
                color: PRIMARY_COLOR,
                font: 'Open Sans',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Tiêu chí đánh giá', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Trọng số', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ shading: { fill: PRIMARY_COLOR }, children: [new Paragraph({ children: [new TextRun({ text: 'Mô tả chi tiết tiêu chuẩn hoàn thành', bold: true, color: 'FFFFFF', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '1. Tính Sư phạm & Kiến thức', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '30%', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nội dung kiến thức chính xác, bám sát chương trình, câu hỏi rõ ràng có giải thích.', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '2. Tính Tương tác & UX', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '30%', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Giao diện chạy mượt, có âm thanh phản hồi, cộng điểm chính xác, nút bấm nhạy.', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '3. Thẩm mỹ & Branding FPT', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '20%', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sử dụng màu Tech Blue #0052CC, Font Open Sans tiếng Việt, bố cục cân đối.', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '4. Tính Khả thi ứng dụng', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '20%', bold: true, size: 18, font: 'Open Sans' })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sẵn sàng dùng để chiếu lên lớp hoặc gửi link cho học sinh ôn tập tại nhà.', size: 18, font: 'Open Sans' })] })] }),
                ],
              }),
            ],
          }),

          // Signatures Section
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'DUYỆT CỦA BAN GIÁM HIỆU', bold: true, size: 20, font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 50 },
                        children: [
                          new TextRun({ text: '(Ký, ghi rõ họ tên)', italics: true, size: 18, color: '64748B', font: 'Open Sans' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'NGƯỜI SOẠN BÀI GIẢNG', bold: true, size: 20, font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 50, after: 800 },
                        children: [
                          new TextRun({ text: '(Ký, ghi rõ họ tên)', italics: true, size: 18, color: '64748B', font: 'Open Sans' }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'TGV. Trần Thị Nhung', bold: true, size: 20, font: 'Open Sans' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
