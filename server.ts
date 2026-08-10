import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI-assisted prompt variable suggestions for teachers
  app.post("/api/suggest-prompt", async (req, res) => {
    try {
      const { subject, grade, lesson_name } = req.body;
      if (!subject || !lesson_name) {
        return res.status(400).json({ error: "Vui lòng nhập Môn học và Tên bài học." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Smart fallback generator for seamless offline / demo usage
        const fallbackData = {
          objective: `Giúp học sinh nắm vững kiến thức cốt lõi và phát triển tư duy phản biện trong bài "${lesson_name}" (Môn ${subject} - Lớp ${grade || 'Chung'}).`,
          core_content: `1. Khái niệm cơ bản & bối cảnh bài học "${lesson_name}"\n2. Phân tích chi tiết nội dung chính và ứng dụng thực tế\n3. Luyện tập củng cố & tổng kết kiến thức trọng tâm`,
          keywords: `${subject}, ${lesson_name}, FPT School, STEM, Tư duy logic`,
          question_count: "5",
          duration: "15 phút"
        };
        return res.json({ success: true, data: fallbackData, note: "Gợi ý thông minh (mẫu demo)" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là chuyên gia giáo dục phổ thông Việt Nam. Hãy gợi ý thông tin cho giáo án dạy học:
Môn học: ${subject}
Khối lớp: ${grade || "Chung"}
Tên bài học: ${lesson_name}

Trả về định dạng JSON thuần túy (không dùng markdown backticks) chứa các trường sau bằng tiếng Việt:
{
  "objective": "Mục tiêu bài học ngắn gọn (2-3 câu)",
  "core_content": "Nội dung cốt lõi theo mốc thời gian hoặc các ý chính (3-5 mục)",
  "keywords": "3-5 từ khóa quan trọng cách nhau bởi dấu phẩy",
  "question_count": "5",
  "duration": "15 phút"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      // Clean JSON string
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Gemini API suggestion error:", err);
      return res.status(500).json({
        error: "Không thể tạo gợi ý tự động. Vui lòng thử lại hoặc điền nội dung thủ công."
      });
    }
  });

  // API endpoint for Custom Webapp Idea AI suggestions
  app.post("/api/suggest-idea", async (req, res) => {
    try {
      const { questionIndex, problem, targetAudience, functions, userFlow, mandatoryContent } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Offline / Smart Fallback Generator based on questionIndex
      const getFallbackSuggestion = (qIdx: number) => {
        const prob = problem || "Học sinh thường nhầm lẫn giữa thiết bị vào và thiết bị ra.";
        const target = targetAudience || "Học sinh THCS";

        switch (qIdx) {
          case 1:
            return { suggestion: "Học sinh khó ghi nhớ các khái niệm lý thuyết trừu tượng và dễ nhầm lẫn khi phân loại dữ liệu thực tế." };
          case 2:
            return { suggestion: "Học sinh lớp 7 (Độ tuổi 12-13, thích thao tác kéo thả và học qua hình ảnh trực quan)" };
          case 3:
            return {
              functions: [
                "Hiển thị danh sách thẻ thông tin/hình ảnh cần phân loại.",
                "Kéo thả hoặc bấm chọn thẻ vào đúng danh mục.",
                "Kiểm tra đáp án tức thì và ghi điểm thưởng.",
                "Hiển thị giải thích chi tiết khi học sinh chọn sai.",
                "Màn hình tổng kết kết quả kèm tuyên dương."
              ]
            };
          case 4:
            return { suggestion: "Mở trang webapp → Đọc hướng dẫn ngắn 15s → Thực hiện thao tác phân loại → Nhận phản hồi đúng/sai tức thì → Xem bảng điểm tổng kết → Nút chơi lại." };
          case 5:
            return { suggestion: "Danh sách 10 thiết bị: Bàn phím, Chuột, Micro, Màn hình, Máy in, Loa, Webcam, Máy chiếu, Cảm biến, Tai nghe. Phân loại chuẩn xác thành Thiết bị vào (Input) và Thiết bị ra (Output)." };
          case 6:
            return {
              uiStyle: ["Sinh động", "Phù hợp học sinh nhỏ tuổi", "Hiện đại"],
              otherUiReqs: "Giao diện màu xanh - trắng tươi sáng, phông chữ to rõ ràng, hiệu ứng phản hồi sinh động khi kéo thả đúng."
            };
          case 7:
            return {
              constraints: [
                "Thời lượng tương tác khoảng 5 phút trong giờ học.",
                "Không yêu cầu đăng nhập hay tạo tài khoản.",
                "Sử dụng mượt mà trên cả máy tính và điện thoại thông minh.",
                "Nội dung hoàn toàn bằng tiếng Việt chuẩn mực.",
                "Có nút chơi lại ngay sau khi hoàn thành."
              ]
            };
          default:
            return { suggestion: "Gợi ý phù hợp với nhu cầu thiết kế webapp." };
        }
      };

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({ success: true, data: getFallbackSuggestion(Number(questionIndex)) });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptText = `Bạn là chuyên gia thiết kế phần mềm giáo dục và UX/UI designer cho trường phổ thông.
Hãy đưa ra gợi ý ngắn gọn, thực tế cho Câu hỏi số ${questionIndex} trong bản thiết kế Webapp Giáo dục:

Bối cảnh hiện tại:
- Vấn đề: ${problem || "Chưa nhập"}
- Đối tượng: ${targetAudience || "Chưa nhập"}
- Chức năng đã có: ${Array.isArray(functions) ? functions.join(", ") : "Chưa có"}

Trả về JSON thuần túy (không dùng markdown codeblock):
Nếu questionIndex = 1 hoặc 2 hoặc 4 hoặc 5:
{"suggestion": "Nội dung gợi ý cụ thể, chất lượng, bám sát thực tế"}

Nếu questionIndex = 3:
{"functions": ["Chức năng 1", "Chức năng 2", "Chức năng 3", "Chức năng 4", "Chức năng 5"]}

Nếu questionIndex = 6:
{"uiStyle": ["Hiện đại", "Sinh động"], "otherUiReqs": "Màu sắc tươi sáng, nút bấm lớn"}

Nếu questionIndex = 7:
{"constraints": ["Ràng buộc 1", "Ràng buộc 2", "Ràng buộc 3"]}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });

      const text = response.text || "";
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({ success: true, data: parsed });
    } catch (err) {
      console.warn("AI suggest idea fallback:", err);
      // Fallback
      const qIdx = Number(req.body.questionIndex) || 1;
      return res.json({ success: true, data: { suggestion: "Nội dung gợi ý do AI đề xuất bám sát nhu cầu giáo viên." } });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "FPT Bac Giang AI Studio Portal" });
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
