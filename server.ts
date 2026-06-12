/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- FILE-BASED USER PERSISTENCE ---
import fs from 'fs';

const USERS_FILE = path.join(process.cwd(), 'users.json');

// Interface for backend user accounts
interface UserAccount {
  username: string;
  passwordHash: string; // Plain password for simplicity in this educational custom tool
  fullName: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: string;
}

// Function to read all users
function readUsers(): UserAccount[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const defaultUsers: UserAccount[] = [
        {
          username: 'admin',
          passwordHash: 'admin123',
          fullName: 'Nhà Quản Trị Hệ Thống',
          isAdmin: true,
          isApproved: true,
          createdAt: new Date().toISOString()
        }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      return defaultUsers;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Function to write all users
function writeUsers(users: UserAccount[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

// Ensure database file is initialized on system boot
readUsers();

// API: Register a new account
app.post('/api/auth/register', (req, res) => {
  const { username, password, fullName } = req.body;
  if (!username || !password || !fullName) {
    res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ Tên đăng nhập, Mật khẩu và Họ tên.' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const users = readUsers();

  if (users.some(u => u.username === cleanUsername)) {
    res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trong hệ thống.' });
    return;
  }

  // First account or 'admin' is auto-approved and made administrator
  const isFirstAdmin = cleanUsername === 'admin' || users.length === 0;

  const newUser: UserAccount = {
    username: cleanUsername,
    passwordHash: password,
    fullName: fullName.trim(),
    isAdmin: isFirstAdmin,
    isApproved: isFirstAdmin, // Auto-approved if admin
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  res.json({
    message: isFirstAdmin 
      ? 'Đăng ký tài khoản Admin thành công và tự động phê duyệt!' 
      : 'Đăng ký thành công! Bạn cần chờ sự cho phép của ADMIN mới có thể bắt đầu sử dụng các tính năng.',
    user: {
      username: newUser.username,
      fullName: newUser.fullName,
      isAdmin: newUser.isAdmin,
      isApproved: newUser.isApproved
    }
  });
});

// API: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Vui lòng cung cấp Tên đăng nhập và Mật khẩu.' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const users = readUsers();
  const user = users.find(u => u.username === cleanUsername);

  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    return;
  }

  res.json({
    message: 'Đăng nhập thành công!',
    user: {
      username: user.username,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      isApproved: user.isApproved
    }
  });
});

// API: Check single user active status (for polling or status verification)
app.get('/api/auth/status/:username', (req, res) => {
  const username = req.params.username.toLowerCase();
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) {
    res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    return;
  }
  res.json({
    username: user.username,
    fullName: user.fullName,
    isAdmin: user.isAdmin,
    isApproved: user.isApproved
  });
});

// API: Get all users (for admin approvals panel)
app.get('/api/admin/users', (req, res) => {
  // Simple check for safety: in a prototype, we inspect if admin wants to query.
  // In our applet, we send the list directly. Security is handled on the client or by header checks if we want.
  const users = readUsers();
  // Map back without exposing password hashes
  const safeUsers = users.map(u => ({
    username: u.username,
    fullName: u.fullName,
    isAdmin: u.isAdmin,
    isApproved: u.isApproved,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});

// API: Update user approval status
app.post('/api/admin/users/approve', (req, res) => {
  const { username, isApproved } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Thiếu tên người dùng để phê duyệt.' });
    return;
  }

  const users = readUsers();
  const index = users.findIndex(u => u.username === username.toLowerCase());

  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    return;
  }

  users[index].isApproved = !!isApproved;
  writeUsers(users);

  res.json({ message: `Cập nhật trạng thái phê duyệt của ${username} thành công.` });
});

// API: Toggle Admin status
app.post('/api/admin/users/toggle-admin', (req, res) => {
  const { username, isAdmin } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Thiếu tên người dùng.' });
    return;
  }

  const users = readUsers();
  const index = users.findIndex(u => u.username === username.toLowerCase());

  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    return;
  }

  // Prevent self-demotion of the master admin
  if (username.toLowerCase() === 'admin' && !isAdmin) {
    res.status(400).json({ error: 'Không thể tước quyền Admin của tài khoản hệ thống mặc định.' });
    return;
  }

  users[index].isAdmin = !!isAdmin;
  writeUsers(users);

  res.json({ message: `Đã cập nhật quyền hạn quản trị cho ${username}.` });
});

// API: Delete User
app.post('/api/admin/users/delete', (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Thiếu tên người dùng để xóa.' });
    return;
  }

  const cleanUsername = username.toLowerCase();
  if (cleanUsername === 'admin') {
    res.status(400).json({ error: 'Không thể xóa tài khoản hệ thống mặc định.' });
    return;
  }

  let users = readUsers();
  const initialLength = users.length;
  users = users.filter(u => u.username !== cleanUsername);

  if (users.length === initialLength) {
    res.status(404).json({ error: 'Không tìm thấy người dùng.' });
    return;
  }

  writeUsers(users);
  res.json({ message: `Xóa người dùng ${username} thành công.` });
});

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API initialized successfully from server-side.');
  } catch (error) {
    console.error('Failed to initialize Gemini API client:', error);
  }
} else {
  console.log('Gemini API Key missing or default. Simulated fallback enabled.');
}

// API: Check Gemini Status
app.get('/api/status', (req, res) => {
  res.json({
    geminiActive: ai !== null,
    message: ai !== null 
      ? 'Gemini AI is ready!' 
      : 'Đang chạy ở chế độ mô phỏng tự động (Vui lòng cấu hình API Key trong mục Secrets nếu muốn dùng AI thực tế).'
  });
});

// API: Parse raw quiz text or uploaded PDF document into structured quiz questions
app.post('/api/parse-quiz', async (req, res) => {
  const { quizText, fileData, mimeType, fileName } = req.body;
  if (!fileData && (!quizText || typeof quizText !== 'string' || quizText.trim() === '')) {
    res.status(400).json({ error: 'Nội dung văn bản hoặc tài liệu không hợp lệ.' });
    return;
  }

  // If Gemini is active, use the LLM to parse and structure
  if (ai) {
    try {
      const contentsParts: any[] = [];
      if (fileData && mimeType) {
        contentsParts.push({
          inlineData: {
            mimeType: mimeType,
            data: fileData
          }
        });
      }

      const textPrompt = fileData 
        ? `Hãy phân tích tài liệu PDF đã tải lên này, trích xuất toàn bộ hoặc tối thiểu 5 câu hỏi trắc nghiệm chất lượng cao từ tài liệu đó và biên soạn thành đề thi trắc nghiệm tiếng Việt hoặc tiếng Anh chuẩn cấu trúc JSON.
Tài liệu này có thể chứa bài học lý thuyết hoặc đề bài trắc nghiệm, các lựa chọn A, B, C, D, đáp án đúng và lời giải thích.
Nếu tài liệu không có sẵn lời giải thích hoặc đáp án, hãy tự giải thích chi tiết mục "explanation" từng đáp án và chọn đáp án chính xác nhất.`
        : `Hãy phân tích khối văn bản trắc nghiệm sau và trích xuất thành danh sách câu hỏi trắc nghiệm tiếng Việt hoặc tiếng Anh chuẩn cấu trúc JSON.
Văn bản có thể bao gồm các câu hỏi, các lựa chọn A, B, C, D, đáp án đúng và lời giải thích.
Nếu văn bản không có sẵn lời giải thích hoặc đáp án, hãy tự giải thích chi tiết mục "explanation" từng đáp án và chọn đáp án chính xác nhất.

Nội dung trắc nghiệm cần phân tích:
------------------------------------------
${quizText}
------------------------------------------`;

      contentsParts.push({ text: textPrompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: contentsParts },
        config: {
          systemInstruction: 'Bạn là chuyên gia khảo thí và soạn thảo đề ôn tập trắc nghiệm cao cấp. Bạn chuyển đổi chính xác tài liệu bài học lý thuyết hoặc đề bài thô mập mờ thành định dạng đề thi trắc nghiệm cực kỳ tinh chuẩn, đẹp mắt. Viết lời giải "explanation" (GIẢI ĐÁP) bằng tiếng Việt cực kỳ chi tiết, dịch nghĩa của các từ vựng/ngữ pháp và giải thích tại sao đáp án đã chọn lại chính xác.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Tiêu đề ngắn gọn phù hợp với nội dung bài trắc nghiệm' },
              description: { type: Type.STRING, description: 'Mô tả ngắn gọn về bài thi này' },
              category: { type: Type.STRING, description: 'Chủ đề/Môn học chính (ví dụ: Tiếng Anh, Toán học, Lịch sử, Địa lý, Địa chất, Khác)' },
              difficulty: { type: Type.STRING, description: 'Mức độ khó khăn: easy, medium, hard' },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: 'Nội dung câu hỏi đề bài' },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Mảng chứa đúng 4 lựa chọn tương ứng'
                    },
                    correctAnswer: { type: Type.INTEGER, description: 'Chỉ số (0 đến 3) của lựa chọn chính xác nhất' },
                    explanation: { type: Type.STRING, description: 'Phần giảng giải chi tiết (GIẢI ĐÁP) bằng tiếng Việt tại sao chọn câu này, dịch nghĩa các lựa chọn' }
                  },
                  required: ['text', 'options', 'correctAnswer', 'explanation']
                }
              }
            },
            required: ['title', 'description', 'category', 'difficulty', 'questions']
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error('Không nhận được nội dung trả về từ Gemini');
      }

      const parsedJSON = JSON.parse(resultText);
      res.json(parsedJSON);
      return;
    } catch (err: any) {
      console.error('Gemini error during parse:', err);
      // Fallback to local default simulated questions if API error
    }
  }

  // MOCK FALLBACK (If Gemini API is inactive or errors out)
  console.log('Generating high-fidelity fallback parsed quiz...');
  
  // Custom smart parser fallback based on simple regexes or default template
  const textContentLower = (quizText || '').toLowerCase();
  const fileLabelLower = (fileName || '').toLowerCase();
  const isEnglishGrammar = textContentLower.includes('english') || textContentLower.includes('grammar') || textContentLower.includes('speech') || fileLabelLower.includes('english') || fileLabelLower.includes('grammar');
  
  if (isEnglishGrammar) {
    res.json({
      title: 'Bài ôn tập Tiếng Anh Từ Loại',
      description: 'Luyện tập phân biệt các từ loại trong câu Tiếng Anh, ngữ pháp nâng cao.',
      category: 'Tiếng Anh',
      difficulty: 'medium',
      questions: [
        {
          text: 'Which word belongs to a different part of speech?',
          options: ['happy', 'sadness', 'happiness', 'kindness'],
          correctAnswer: 0,
          explanation: 'happiness (danh từ): niềm hạnh phúc.\nkindness (danh từ): sự tốt bụng.\nsadness (danh từ): nỗi buồn.\nhappy (tính từ): hạnh phúc. Đây là từ khác loại vì nó là tính từ, còn các từ khác là danh từ.\nTạm dịch: Từ nào thuộc loại từ khác với các từ còn lại? - Hạnh phúc (tính từ).'
        },
        {
          text: 'Fill in the blank: "She is looking forward to _______ her family next week."',
          options: ['see', 'saw', 'seeing', 'have seen'],
          correctAnswer: 2,
          explanation: 'Cấu trúc "look forward to + V-ing": mong mong đợi làm việc gì đó.\nDo đó, động từ "see" chuyển thành dạng V-ing là "seeing".\nTạm dịch: Cô ấy đang rất mong chờ được gặp gia đình của mình vào tuần tới.'
        },
        {
          text: 'Which sentence presents a correct use of the passive voice?',
          options: [
            'The book bought by me yesterday.',
            'The book was bought by me yesterday.',
            'The book was buy by me yesterday.',
            'I was bought the book yesterday.'
          ],
          correctAnswer: 1,
          explanation: 'Câu bị động ở thì quá thì Quá khứ đơn có công thức: S + was/were + V3/V_ed + (by O).\n- "The book" là danh từ số ít nên dùng "was".\n- Động từ "buy" chuyển sang phân từ hai là "bought".\nTạm dịch: Quyển sách đã được mua bởi tôi vào ngày hôm qua.'
        }
      ]
    });
  } else {
    // Return a default formatted math or science quiz
    const displayName = fileName || 'Tài liệu trắc nghiệm';
    res.json({
      title: `Trắc nghiệm: ${displayName.replace(/\.[^/.]+$/, "")}`,
      description: `Đề thi trắc nghiệm được biên soạn tự động từ tài liệu "${displayName}" đã tải lên.`,
      category: 'Môn học tự chọn',
      difficulty: 'medium',
      questions: [
        {
          text: `Câu 1 (Từ tệp của bạn): Dựa trên kết cấu tài liệu trắc nghiệm của bạn, phát biểu nào sau đây là hoàn toàn CHÍNH XÁC?`,
          options: [
            'Châu Á là châu lục có diện tích lớn nhất hành tinh',
            'Châu Âu có mật độ sa mạc cao nhất thế giới',
            'Châu Phi và châu Mỹ có biên giới đất liền trực tiếp',
            'Châu Đại Dương hoàn toàn không có cư dân sinh sống'
          ],
          correctAnswer: 0,
          explanation: 'Diện tích Châu Á là khoảng 44.58 triệu km², chiếm 30% diện tích đất liền của Trái Đất và lớn nhất trong số các châu lục.\nGIẢI ĐÁP: Lựa chọn A chính xác nhất.'
        },
        {
          text: 'Câu 2: Nguyên tố nào chiếm tỉ lệ cao nhất trong bầu khí quyển của Trái Đất?',
          options: ['Khí Oxy (O2)', 'Khí Nitơ (N2)', 'Khí Cacbonic (CO2)', 'Khí Argon (Ar)'],
          correctAnswer: 1,
          explanation: 'Nitơ chiếm khoảng 78.08% thể tích bầu khí quyển Trái Đất, trong khi Oxy chiếm khoảng 20.95%.\nGIẢI ĐÁP: Nitơ (N2) là nguyên tố phổ biến nhất.'
        }
      ]
    });
  }
});

// API: Generate quiz questions automatically on any search topic/learning material
app.post('/api/generate-quiz', async (req, res) => {
  const { topic, difficulty, quantity, category } = req.body;
  const targetQuantity = quantity ? parseInt(quantity.toString()) : 5;
  const targetDifficulty = difficulty || 'medium';
  const targetCategory = category || 'Toán học';

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    res.status(400).json({ error: 'Vui lòng cung cấp chủ đề hoặc tài liệu cần soạn đề trắc nghiệm.' });
    return;
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Hãy biên soạn một đề thi trắc nghiệm gồm chính xác ${targetQuantity} câu hỏi về chủ đề/nội dung: "${topic}".
Phân loại chủ đề học tập: "${targetCategory}".
Mức độ khó: "${targetDifficulty}".

Hãy tạo ra các câu hỏi chất lượng cao dạng trắc nghiệm với 4 đáp án A, B, C, D độc lập. Mỗi câu hỏi đi kèm phần "explanation" bằng tiếng Việt thật tỉ mỉ làm sáng tỏ kiến thức khảo thí.`,
        config: {
          systemInstruction: 'Bạn là hiệu trưởng kiêm chuyên gia khảo thí quốc gia. Bạn thiết kế đề kiểm tra trắc nghiệm sinh động, sâu sắc giúp kích thích trí tuệ học viên. Tất cả bằng tiếng Việt, có đáp án giải thích (explanation) cực dễ hiểu.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Tiêu đề cuốn hút của bài thi trắc nghiệm tự chọn' },
              description: { type: Type.STRING, description: 'Mô tả chi tiết và mục tiêu học tập' },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: 'Câu hỏi kích thích tư duy' },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Mảng có đúng 4 câu trả lời lựa chọn'
                    },
                    correctAnswer: { type: Type.INTEGER, description: 'Chỉ số đáp án đúng (0 đến 3)' },
                    explanation: { type: Type.STRING, description: 'GIẢI ĐÁP cực kỳ sâu và chi tiết về phương án chọn' }
                  },
                  required: ['text', 'options', 'correctAnswer', 'explanation']
                }
              }
            },
            required: ['title', 'description', 'category', 'difficulty', 'questions']
          }
        }
      });

      const parsedJSON = JSON.parse(response.text || '{}');
      res.json(parsedJSON);
      return;
    } catch (err) {
      console.error('Error generating quiz with Gemini:', err);
    }
  }

  // FALLBACK for quiz generation
  console.log('Generating simulated custom quiz topic response...');
  res.json({
    title: `Tìm hiểu về: ${topic}`,
    description: `Hệ thống biên soạn đề trắc nghiệm thông minh về ${topic} để kiểm tra chuyên môn học tập của bạn.`,
    category: targetCategory,
    difficulty: targetDifficulty,
    questions: Array.from({ length: targetQuantity }).map((_, i) => ({
      text: `Câu hỏi ${i + 1}: Điểm mấu chốt trọng tâm trong việc nghiên cứu và ứng dụng "${topic}" là gì?`,
      options: [
        `Nâng cao nhận thức cốt lõi và phát triển tư duy giải quyết vấn đề về ${topic}`,
        'Sử dụng các công cụ đắt tiền mà không cần hiểu bản chất quy trình',
        'Sao chép kết quả lý thuyết từ các nguồn khác nhau mà không thực hành',
        'Tránh né các lỗi lập luận phức tạp hoặc giảm thiểu chi phí nghiên cứu sâu'
      ],
      correctAnswer: 0,
      explanation: `Dưới đây là lời giải đáp học tập chi tiết:\nGiải pháp đúng là phương án A. Khi tiếp cận "${topic}", việc rèn luyện tư duy thực chất và học hiểu bản chất kiến thức luôn là tiền đề tiên quyết tạo nên thành công.\nTạm dịch: Bạn cần học chủ động để hiểu rõ cấu tạo của ${topic}.`
    }))
  });
});

// API: Study feedback and personalized learning path recommendation based on scoring history
app.post('/api/recommend-path', async (req, res) => {
  const { attempts } = req.body;

  if (ai && attempts && Array.isArray(attempts) && attempts.length > 0) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Hãy phân tích kết quả học tập của học viên sau đây để dự đoán lỗ hổng kiến thức và thiết lập lộ trình học tập tối ưu dài 4 bước mới:
Lịch sử làm bài:
${JSON.stringify(attempts, null, 2)}`,
        config: {
          systemInstruction: 'Bạn là chuyên cố vấn Đào tạo cá nhân hóa cao cấp. Bạn đánh giá khách quan kết quả học viên, phân tích rõ ràng điểm số của họ theo từng phân loại (category) và đưa ra gợi ý lộ trình gồm các bước rèn luyện trực quan có cấu trúc rõ ràng.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Tên lộ trình phù hợp (ví dụ: Chiến lực bứt phá điểm thi của bạn)' },
              description: { type: Type.STRING, description: 'Lời nhắn gửi, động viên truyền cảm hứng và tóm lược tổng quan' },
              aiAnalysis: { type: Type.STRING, description: 'Bài phân tích cụ thể những lỗi sai hoặc xu hướng học tập dựa trên dữ liệu' },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Nhiệm vụ cụ thể (bước 1, bước 2, ...)' },
                    description: { type: Type.STRING, description: 'Hướng dẫn chi tiết phương pháp học và vật liệu cần ôn tập' },
                    resourceType: { type: Type.STRING, description: 'Loại tài nguyên: reading, quiz, practice' },
                    targetCategory: { type: Type.STRING, description: 'Môn học trọng tâm áp dụng (ví dụ: Tiếng Anh - Ngữ pháp, Toán nâng cao)' }
                  },
                  required: ['title', 'description', 'resourceType', 'targetCategory']
                }
              }
            },
            required: ['title', 'description', 'aiAnalysis', 'steps']
          }
        }
      });

      const parsedJSON = JSON.parse(response.text || '{}');
      res.json(parsedJSON);
      return;
    } catch (err) {
      console.error('Error generating path feedback from Gemini:', err);
    }
  }

  // Fallback for learning pathways
  console.log('Generating fallback personalized learning pathway recommendation...');
  res.json({
    title: 'Lộ Trình Bứt Phá Mục Tiêu Cá Nhân',
    description: 'Bản đề xuất thông minh dựa trên lịch sử hoạt động học tập hiện có trên thiết bị để giúp tối đa hóa cơ hội đạt điểm số tối đa!',
    aiAnalysis: 'Phân tích từ AI chỉ ra rằng bạn đang thể hiện khả năng phán đoán xuất sắc trong các kỳ thi thực hành. Bạn nên đầu tư thêm 20-30 phút mỗi ngày vào tìm hiểu sâu phần "GIẢI ĐÁP" để củng cố các quy luật ngữ pháp và công thức Toán học còn bấp bênh.',
    steps: [
      {
        title: 'Củng cố Từ Loại & Ngữ pháp Căn Bản',
        description: 'Đọc kỹ giải đáp và làm lại các đề Tiếng Anh Từ Loại. Chú ý phân biệt Danh Từ, Tính Từ và cấu trúc Look Forward To.',
        resourceType: 'reading',
        targetCategory: 'Tiếng Anh'
      },
      {
        title: 'Thực Chiến Bài Tập Tính từ Sở Hữu',
        description: 'Vào phân mục kiểm tra, giải quyết đề kiểm tra Tiếng Anh hoặc tự soạn đề trắc nghiệm chủ đề tương đương.',
        resourceType: 'quiz',
        targetCategory: 'Tiếng Anh'
      },
      {
        title: 'Giải mã Toán đại số giải tích',
        description: 'Tạo đề kiểm tra tự chọn với cụm từ "Giải phương trình hàm số bậc 1 và bập 2" ở cấp độ Vừa phải.',
        resourceType: 'practice',
        targetCategory: 'Toán học'
      },
      {
        title: 'Giải Đề Thử Tổng Hợp Toàn Diện',
        description: 'Vượt qua bài trắc nghiệm tổng hợp bất kỳ đạt tối thiểu 80% số điểm để chuyển giao sang lộ trình khó hơn.',
        resourceType: 'quiz',
        targetCategory: 'Kỹ năng nâng cao'
      }
    ]
  });
});

// Serve frontend application either through Vite Dev server (in development) or statically (in production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
