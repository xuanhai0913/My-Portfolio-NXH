import { learnsprint } from '../../data/learnsprint';

export const entries = [
  {
    id: 'learnsprint', name: 'LearnSprint', event: learnsprint.competitionName,
    image: learnsprint.image, embed: learnsprint.embed, youtube: learnsprint.youtube,
    source: learnsprint.github, submission: learnsprint.submission, demo: learnsprint.demo,
    stack: ['React', 'NestJS', 'Amazon Bedrock', 'MCP'],
    en: {
      status: 'Submitted · 26 Sep 2026', tagline: 'Practice your first shift.',
      role: 'Solo creator · Product, full-stack & AWS',
      summary: 'A simulated work shift where learners investigate stock, plan deliveries and explain their decisions.',
      problem: 'How can someone practise workplace decisions before their first day on the job?',
      contribution: 'I built the learning flow, application and self-hosted MCP server, then submitted a working AWS demo.',
      decision: 'AI proposes bounded edits. Learners explicitly Apply or Undo, keeping decisions in their hands.',
      lesson: 'A useful learning experience needs consequences: decisions persist into a replay with changed conditions.',
      evidence: 'Recorded demo · English narration, EN/VI captions',
    },
    vi: {
      status: 'Đã nộp bài · 26/09/2026', tagline: 'Tập làm trước ca đầu tiên.',
      role: 'Tự phát triển · Sản phẩm, full-stack & AWS',
      summary: 'Một ca làm việc mô phỏng để người học kiểm tra tồn kho, lên kế hoạch giao hàng và giải thích quyết định.',
      problem: 'Làm sao để người mới tập ra quyết định trong công việc trước ngày đi làm đầu tiên?',
      contribution: 'Tôi xây dựng luồng học, ứng dụng và MCP server tự host, rồi nộp bản demo chạy trên AWS.',
      decision: 'AI đề xuất thay đổi có giới hạn. Người học tự chọn Apply hoặc Undo để giữ quyền quyết định.',
      lesson: 'Học qua tình huống cần có hệ quả: quyết định được giữ lại khi chơi lại với điều kiện thay đổi.',
      evidence: 'Video demo · Thuyết minh tiếng Anh, phụ đề EN/VI',
    },
  },
  {
    id: 'scamsignal', name: 'ScamSignal AI', event: 'AI Riser Vietnam 2026',
    image: '/images/projects/scamsignal/preview.png', embed: 'https://www.youtube-nocookie.com/embed/smURKqcLXMw', youtube: 'https://youtu.be/smURKqcLXMw',
    source: 'https://github.com/xuanhai0913/scamsignal-ai-riser-2026', certificate: '/images/community-ai-riser-certificate.png',
    stack: ['Gemini', 'Google AI Studio', 'React'],
    en: {
      status: 'Participant · 2026', tagline: 'Pause before you trust.',
      role: 'Creator · Product, full-stack & AI',
      summary: 'A Vietnamese-first assistant that explains warning signs in suspicious messages, links and screenshots.',
      problem: 'A suspicious message often creates urgency. People need understandable evidence before taking action.',
      contribution: 'I built the analysis flow, Trust Twin verification and a Rescue flow that saves a support record locally.',
      decision: 'When AI is unavailable, the fallback identifies its limits rather than presenting a made-up AI confidence score.',
      lesson: 'Risk signals need context. A warning is a reason to verify, not proof that every flagged message is a scam.',
      evidence: 'Submitted demo · Product walkthrough',
    },
    vi: {
      status: 'Tham gia · 2026', tagline: 'Chậm một nhịp, kiểm tra kỹ hơn.',
      role: 'Tác giả · Sản phẩm, full-stack & AI',
      summary: 'Trợ lý ưu tiên tiếng Việt, giải thích dấu hiệu đáng ngờ trong tin nhắn, đường link và ảnh chụp màn hình.',
      problem: 'Tin nhắn đáng ngờ thường gây áp lực thời gian. Người nhận cần bằng chứng dễ hiểu trước khi hành động.',
      contribution: 'Tôi xây dựng luồng phân tích, xác minh Trust Twin và Rescue để lưu hồ sơ hỗ trợ ngay trên thiết bị.',
      decision: 'Khi AI không phản hồi, chế độ dự phòng ghi rõ giới hạn thay vì hiển thị điểm tin cậy AI giả.',
      lesson: 'Dấu hiệu rủi ro cần được đặt trong ngữ cảnh. Cảnh báo là lý do để xác minh, chưa phải kết luận lừa đảo.',
      evidence: 'Video bài dự thi · Giới thiệu sản phẩm',
    },
  },
];

export const copy = {
  en: {
    eyebrow: 'Competition projects / 2026', title: 'Built for a challenge.', intro: 'Working demos. Personal contributions. Lessons worth keeping.',
    all: 'Explore the competition projects', watch: 'Watch demo', stop: 'Close video', youtube: 'Open on YouTube', story: 'Behind the build',
    problem: 'The problem', contribution: 'My contribution', decision: 'Engineering decision', lesson: 'What I learned', source: 'Source code',
    submission: 'Submission', demo: 'Try the app', certificate: 'View certificate', event: 'Event memories', back: 'Back to portfolio',
    next: 'Also in this collection', preview: 'Product screenshot', footer: 'The submission is a milestone. The work behind it is the story.',
  },
  vi: {
    eyebrow: 'Dự án cuộc thi / 2026', title: 'Thử sức. Làm đến cùng.', intro: 'Demo thực tế, phần việc tôi làm và những bài học giữ lại.',
    all: 'Khám phá các dự án cuộc thi', watch: 'Xem demo', stop: 'Đóng video', youtube: 'Mở trên YouTube', story: 'Câu chuyện phía sau',
    problem: 'Bài toán', contribution: 'Phần việc tôi làm', decision: 'Quyết định kỹ thuật', lesson: 'Điều tôi học được', source: 'Mã nguồn',
    submission: 'Bài dự thi', demo: 'Thử ứng dụng', certificate: 'Xem chứng nhận', event: 'Khoảnh khắc sự kiện', back: 'Về portfolio',
    next: 'Cùng hành trình', preview: 'Ảnh chụp sản phẩm', footer: 'Nộp bài là một dấu mốc. Quá trình làm ra sản phẩm mới là câu chuyện.',
  },
};
