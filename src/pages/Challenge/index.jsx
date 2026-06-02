import React, { useMemo, useState } from 'react';
import './styles/Challenge.css';

const QUESTION_TYPES = [
  {
    id: 'error-detective',
    code: 'CN10',
    title: 'Bắt lỗi trong câu',
    shortTitle: 'Error Detective',
    reusableFor: 'Trợ từ, chia thể, kính ngữ, collocation, chính tả kana',
    description: 'Học viên tìm đoạn sai trong câu rồi chọn cách sửa đúng. Khác với trắc nghiệm vì thao tác chính là phát hiện lỗi trong ngữ cảnh.',
    mechanic: 'Tap wrong span -> choose correction',
    accent: 'red'
  },
  {
    id: 'conjugation-combo',
    code: 'CN11',
    title: 'Combo chia thể',
    shortTitle: 'Conjugation Combo',
    reusableFor: 'Động từ, tính từ, thể て, thể ない, thể khả năng, thể bị động',
    description: 'Học viên biến đổi từ gốc qua nhiều bước bằng chip thao tác, phù hợp luyện grammar dạng chuyển đổi.',
    mechanic: 'Base word -> transformation chain',
    accent: 'amber'
  },
  {
    id: 'category-sort',
    code: 'CN12',
    title: 'Phân loại hộp từ',
    shortTitle: 'Category Sort',
    reusableFor: 'Từ loại, chủ đề vocab, tự/tha động từ, casual/polite, JLPT level',
    description: 'Kéo hoặc chọn từ để đưa vào nhóm đúng. Có thể dùng cho gần như mọi bộ từ vựng.',
    mechanic: 'Select item -> drop into category',
    accent: 'lime'
  },
  {
    id: 'pitch-accent',
    code: 'CN13',
    title: 'Chọn mẫu ngữ điệu',
    shortTitle: 'Pitch Accent',
    reusableFor: 'Pitch accent, nghe phân biệt từ đồng âm, shadowing nền tảng',
    description: 'Học viên nghe từ rồi chọn contour cao-thấp đúng. Đây là dạng mới cho pronunciation nhưng không cần ghi âm.',
    mechanic: 'Audio cue -> pitch contour',
    accent: 'cyan'
  },
  {
    id: 'mora-rhythm',
    code: 'CN14',
    title: 'Gõ nhịp mora',
    shortTitle: 'Mora Rhythm',
    reusableFor: 'Trường âm, âm ngắt, nhịp câu, phân biệt おばさん / おばあさん',
    description: 'Học viên bấm theo số nhịp mora nghe được. Dạng này giúp sửa lỗi nghe/nói rất Nhật mà chưa có trong CN01-CN09.',
    mechanic: 'Listen -> tap rhythm count',
    accent: 'blue'
  },
  {
    id: 'evidence-highlight',
    code: 'CN15',
    title: 'Highlight bằng chứng',
    shortTitle: 'Evidence Highlight',
    reusableFor: 'Dokkai, email, memo, thông báo, đọc hiểu tìm thông tin',
    description: 'Không chỉ chọn đáp án, học viên phải bôi chọn câu/cụm chứng minh đáp án. Tốt cho đọc hiểu và review vì biết học viên hiểu từ đâu.',
    mechanic: 'Question -> highlight evidence span',
    accent: 'paper'
  },
  {
    id: 'register-switch',
    code: 'CN16',
    title: 'Chuyển sắc thái câu',
    shortTitle: 'Register Switch',
    reusableFor: 'Casual, polite, keigo, business Japanese, hội thoại theo vai',
    description: 'Học viên chuyển câu từ thân mật sang lịch sự hoặc kính ngữ bằng các lựa chọn biến đổi.',
    mechanic: 'Source sentence -> target register',
    accent: 'violet'
  },
  {
    id: 'kanji-assembly',
    code: 'CN17',
    title: 'Ghép thành phần Kanji',
    shortTitle: 'Kanji Assembly',
    reusableFor: 'Bộ thủ, cấu tạo kanji, nhận diện mặt chữ, nghĩa gốc',
    description: 'Khác tập viết: không vẽ nét mà chọn thành phần để lắp thành chữ. Hợp cho nhớ kanji bằng cấu trúc.',
    mechanic: 'Radical parts -> kanji meaning',
    accent: 'ink'
  }
];

const speakJapanese = (text) => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.86;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

const ResultPill = ({ state, correctText }) => {
  if (!state) return null;

  return (
    <div className={`challenge-result challenge-result--${state}`}>
      {state === 'correct' ? 'Đúng. Có thể qua câu tiếp theo.' : `Chưa đúng. Gợi ý đáp án: ${correctText}`}
    </div>
  );
};

const WaveBars = () => (
  <span className="challenge-wave" aria-hidden="true">
    {Array.from({ length: 11 }).map((_, index) => (
      <i key={index} style={{ '--bar-index': index }} />
    ))}
  </span>
);

const ErrorDetectiveDemo = () => {
  const [selectedSpan, setSelectedSpan] = useState(null);
  const [correction, setCorrection] = useState(null);
  const isCorrect = selectedSpan === 'wrong' && correction === 'へ';

  return (
    <div className="demo-panel">
      <p className="demo-label">Tìm lỗi sai trong câu và sửa lại</p>
      <div className="sentence-inspector">
        {[
          ['わたしは', 'safe'],
          ['学校に', 'wrong'],
          ['行きます', 'safe']
        ].map(([text, key]) => (
          <button
            key={text}
            type="button"
            className={selectedSpan === key ? 'inspect-token inspect-token--selected' : 'inspect-token'}
            onClick={() => setSelectedSpan(key)}
          >
            {text}
          </button>
        ))}
      </div>
      <div className="choice-row">
        {['を', 'へ', 'で'].map((item) => (
          <button key={item} type="button" onClick={() => setCorrection(item)}>
            {item}
          </button>
        ))}
      </div>
      <ResultPill state={correction ? (isCorrect ? 'correct' : 'wrong') : null} correctText="学校へ行きます" />
    </div>
  );
};

const ConjugationComboDemo = () => {
  const [steps, setSteps] = useState([]);
  const targetSteps = ['て形', 'ください'];
  const result = steps.length === 2 ? (steps.join('|') === targetSteps.join('|') ? 'correct' : 'wrong') : null;

  const chooseStep = (step) => {
    setSteps((current) => (current.includes(step) ? current.filter((item) => item !== step) : [...current, step].slice(-2)));
  };

  return (
    <div className="demo-panel">
      <div className="combo-track">
        <span>書く</span>
        <b>→</b>
        <span>{steps[0] === 'て形' ? '書いて' : '____'}</span>
        <b>→</b>
        <span>{steps.join('|') === targetSteps.join('|') ? '書いてください' : '____'}</span>
      </div>
      <div className="choice-row">
        {['ます形', 'て形', 'ください', 'ない形'].map((step) => (
          <button key={step} type="button" className={steps.includes(step) ? 'selected-chip' : ''} onClick={() => chooseStep(step)}>
            {step}
          </button>
        ))}
      </div>
      <ResultPill state={result} correctText="書く → 書いて → 書いてください" />
    </div>
  );
};

const CategorySortDemo = () => {
  const words = ['きれい', '学生', '飲む', '静か', '先生', '行く'];
  const [selectedWord, setSelectedWord] = useState(null);
  const [groups, setGroups] = useState({ noun: [], verb: [], adjective: [] });
  const correctMap = { 学生: 'noun', 先生: 'noun', 飲む: 'verb', 行く: 'verb', きれい: 'adjective', 静か: 'adjective' };
  const total = Object.values(groups).flat().length;
  const correct = Object.entries(groups).every(([group, items]) => items.every((item) => correctMap[item] === group));

  const placeWord = (group) => {
    if (!selectedWord) return;
    setGroups((current) => {
      const next = Object.fromEntries(Object.entries(current).map(([key, items]) => [key, items.filter((item) => item !== selectedWord)]));
      next[group] = [...next[group], selectedWord];
      return next;
    });
    setSelectedWord(null);
  };

  return (
    <div className="demo-panel">
      <div className="word-bank">
        {words.map((word) => (
          <button key={word} type="button" className={selectedWord === word ? 'selected-chip' : ''} onClick={() => setSelectedWord(word)}>
            {word}
          </button>
        ))}
      </div>
      <div className="category-grid">
        {[
          ['noun', 'Danh từ'],
          ['verb', 'Động từ'],
          ['adjective', 'Tính từ']
        ].map(([key, label]) => (
          <button key={key} type="button" className="category-box" onClick={() => placeWord(key)}>
            <strong>{label}</strong>
            <span>{groups[key].join(' ・ ') || 'Chọn từ rồi bấm vào đây'}</span>
          </button>
        ))}
      </div>
      <ResultPill state={total === words.length ? (correct ? 'correct' : 'wrong') : null} correctText="学生/先生, 飲む/行く, きれい/静か" />
    </div>
  );
};

const PitchAccentDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = 'heiban';
  const patterns = [
    ['heiban', '平板', 'low-high-high'],
    ['atamadaka', '頭高', 'high-low-low'],
    ['nakadaka', '中高', 'low-high-low'],
    ['odaka', '尾高', 'low-high-high↓']
  ];

  return (
    <div className="demo-panel">
      <button className="audio-button" type="button" onClick={() => speakJapanese('さくら')}>
        <span>さくら</span>
        <WaveBars />
      </button>
      <div className="pitch-grid">
        {patterns.map(([key, label, contour]) => (
          <button key={key} type="button" className={choice === key ? 'pitch-card pitch-card--selected' : 'pitch-card'} onClick={() => setChoice(key)}>
            <strong>{label}</strong>
            <span>{contour}</span>
            <div className={`pitch-line pitch-line--${key}`} />
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText="平板 / low-high-high" />
    </div>
  );
};

const MoraRhythmDemo = () => {
  const [taps, setTaps] = useState(0);
  const correctCount = 5;

  return (
    <div className="demo-panel">
      <button className="audio-button" type="button" onClick={() => speakJapanese('おばあさん')}>
        <span>おばあさん</span>
        <WaveBars />
      </button>
      <button className="tap-pad" type="button" onClick={() => setTaps((count) => Math.min(count + 1, 8))}>
        Tap mora
        <span>{Array.from({ length: taps }).map((_, index) => <i key={index} />)}</span>
      </button>
      <button className="ghost-action" type="button" onClick={() => setTaps(0)}>Reset</button>
      <ResultPill state={taps ? (taps === correctCount ? 'correct' : taps > correctCount ? 'wrong' : null) : null} correctText="5 mora: お・ば・あ・さ・ん" />
    </div>
  );
};

const EvidenceHighlightDemo = () => {
  const [selected, setSelected] = useState(null);
  const correct = 'nine';

  return (
    <div className="demo-panel">
      <p className="demo-question">Câu hỏi: Người học cần liên hệ trước mấy giờ?</p>
      <div className="reading-strip">
        <button type="button" onClick={() => setSelected('breakfast')}>朝ごはんを食べたい人は、</button>
        <button type="button" onClick={() => setSelected('nine')}>前の日の夜9時までに</button>
        <button type="button" onClick={() => setSelected('contact')}>連絡してください。</button>
      </div>
      <ResultPill state={selected ? (selected === correct ? 'correct' : 'wrong') : null} correctText="前の日の夜9時までに" />
    </div>
  );
};

const RegisterSwitchDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = '少々お待ちください。';

  return (
    <div className="demo-panel">
      <div className="register-card">
        <small>Casual → Polite service</small>
        <p>ちょっと待って。</p>
      </div>
      <div className="choice-row">
        {['待ってください。', '少々お待ちください。', '待ちたいです。'].map((item) => (
          <button key={item} type="button" onClick={() => setChoice(item)}>
            {item}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText="少々お待ちください。" />
    </div>
  );
};

const KanjiAssemblyDemo = () => {
  const [parts, setParts] = useState([]);
  const correct = ['日', '月'];
  const result = parts.length === 2 ? (correct.every((part) => parts.includes(part)) ? 'correct' : 'wrong') : null;

  const togglePart = (part) => {
    setParts((current) => {
      if (current.includes(part)) return current.filter((item) => item !== part);
      return current.length >= 2 ? [current[1], part] : [...current, part];
    });
  };

  return (
    <div className="demo-panel">
      <div className="kanji-target">
        <span>{parts.join(' + ') || 'Chọn thành phần'}</span>
        <strong>明</strong>
        <small>sáng / rõ ràng</small>
      </div>
      <div className="part-grid">
        {['日', '月', '水', '木', '口', '心'].map((part) => (
          <button key={part} type="button" className={parts.includes(part) ? 'part-tile part-tile--selected' : 'part-tile'} onClick={() => togglePart(part)}>
            {part}
          </button>
        ))}
      </div>
      <ResultPill state={result} correctText="日 + 月 = 明" />
    </div>
  );
};

const DemoStage = ({ activeType }) => {
  switch (activeType.id) {
    case 'error-detective':
      return <ErrorDetectiveDemo />;
    case 'conjugation-combo':
      return <ConjugationComboDemo />;
    case 'category-sort':
      return <CategorySortDemo />;
    case 'pitch-accent':
      return <PitchAccentDemo />;
    case 'mora-rhythm':
      return <MoraRhythmDemo />;
    case 'evidence-highlight':
      return <EvidenceHighlightDemo />;
    case 'register-switch':
      return <RegisterSwitchDemo />;
    case 'kanji-assembly':
      return <KanjiAssemblyDemo />;
    default:
      return null;
  }
};

const Challenge = () => {
  const [activeId, setActiveId] = useState(QUESTION_TYPES[0].id);
  const activeType = useMemo(() => QUESTION_TYPES.find((item) => item.id === activeId) || QUESTION_TYPES[0], [activeId]);

  return (
    <main className="challenge-lab">
      <section className="challenge-hero">
        <div className="challenge-kicker">New Challenge Question Ideas</div>
        <h1>8 dạng câu hỏi mới, né CN01-CN09 đã có</h1>
        <p>
          Bộ mock này chỉ tập trung vào mechanic mới có thể tái sử dụng cho nhiều bài tiếng Nhật. UI mượn cảm giác Nhật nhẹ,
          nhưng không khóa vào một chủ đề như đền, tàu, lễ hội hay đồ ăn.
        </p>
      </section>

      <section className="challenge-layout" aria-label="New challenge question type demos">
        <aside className="challenge-type-list">
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`challenge-type-card challenge-type-card--${type.accent} ${
                activeId === type.id ? 'challenge-type-card--active' : ''
              }`}
              onClick={() => setActiveId(type.id)}
            >
              <span className="type-number">{type.code}</span>
              <span>
                <strong>{type.title}</strong>
                <small>{type.reusableFor}</small>
              </span>
            </button>
          ))}
        </aside>

        <article className={`challenge-showcase challenge-showcase--${activeType.accent}`}>
          <div className="showcase-header">
            <div>
              <span className="prefix-stamp">{activeType.code}</span>
              <h2>{activeType.title}</h2>
              <p>{activeType.description}</p>
            </div>
            <div className="mechanic-label">{activeType.mechanic}</div>
          </div>

          <DemoStage key={activeType.id} activeType={activeType} />

          <div className="reuse-note">
            <strong>Không trùng dạng cũ:</strong> không phải trắc nghiệm, nối cặp, sắp xếp câu, nhập chữ, luyện nói,
            tập viết, điền chỗ trống, bài đọc QA, hay nghe chọn cột.
          </div>
        </article>
      </section>
    </main>
  );
};

export default Challenge;
