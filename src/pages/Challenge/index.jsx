import React, { useMemo, useState } from 'react';
import './styles/Challenge.css';

const QUESTION_TYPES = [
  {
    id: 'error-detective',
    code: 'CN10',
    title: 'Bắt lỗi trong câu',
    reusableFor: 'Trợ từ, chia thể, kính ngữ, collocation, chính tả kana',
    description: 'Học viên tìm đoạn sai trong câu rồi chọn cách sửa đúng. Khác với trắc nghiệm vì thao tác chính là phát hiện lỗi trong ngữ cảnh.',
    mechanic: 'Chọn đoạn sai, sau đó chọn cách sửa',
    signal: 'Biết học viên sai ở bước phát hiện lỗi hay bước sửa lỗi',
    accent: 'red'
  },
  {
    id: 'conjugation-combo',
    code: 'CN11',
    title: 'Combo chia thể',
    reusableFor: 'Động từ, tính từ, thể て, thể ない, thể khả năng, thể bị động',
    description: 'Học viên biến đổi từ gốc qua nhiều bước bằng chip thao tác, phù hợp luyện grammar dạng chuyển đổi.',
    mechanic: 'Từ gốc đi qua chuỗi biến đổi',
    signal: 'Thấy rõ học viên hỏng ở bước chia thể nào',
    accent: 'amber'
  },
  {
    id: 'category-sort',
    code: 'CN12',
    title: 'Phân loại hộp từ',
    reusableFor: 'Từ loại, chủ đề vocab, tự/tha động từ, casual/polite, JLPT level',
    description: 'Kéo hoặc chọn từ để đưa vào nhóm đúng. Có thể dùng cho gần như mọi bộ từ vựng.',
    mechanic: 'Chọn item rồi đưa vào nhóm',
    signal: 'Nhìn được nhóm kiến thức đang bị lẫn',
    accent: 'lime'
  },
  {
    id: 'pitch-accent',
    code: 'CN13',
    title: 'Chọn mẫu ngữ điệu',
    reusableFor: 'Pitch accent, nghe phân biệt từ đồng âm, shadowing nền tảng',
    description: 'Học viên nghe từ rồi chọn contour cao-thấp đúng. Đây là dạng mới cho pronunciation nhưng không cần ghi âm.',
    mechanic: 'Nghe âm thanh rồi chọn đường cao-thấp',
    signal: 'Đo được khả năng nghe ngữ điệu thay vì chỉ đọc chữ',
    accent: 'cyan'
  },
  {
    id: 'mora-rhythm',
    code: 'CN14',
    title: 'Gõ nhịp mora',
    reusableFor: 'Trường âm, âm ngắt, nhịp câu, phân biệt おばさん / おばあさん',
    description: 'Học viên bấm theo số nhịp mora nghe được. Dạng này giúp sửa lỗi nghe/nói rất Nhật mà chưa có trong CN01-CN09.',
    mechanic: 'Nghe rồi gõ số nhịp mora',
    signal: 'Phát hiện lỗi nghe thiếu trường âm hoặc âm ngắt',
    accent: 'blue'
  },
  {
    id: 'evidence-highlight',
    code: 'CN15',
    title: 'Highlight bằng chứng',
    reusableFor: 'Dokkai, email, memo, thông báo, đọc hiểu tìm thông tin',
    description: 'Không chỉ chọn đáp án, học viên phải bôi chọn câu/cụm chứng minh đáp án. Tốt cho đọc hiểu và review vì biết học viên hiểu từ đâu.',
    mechanic: 'Chọn câu/cụm làm bằng chứng',
    signal: 'Biết học viên trả lời nhờ hiểu đoạn nào',
    accent: 'paper'
  },
  {
    id: 'register-switch',
    code: 'CN16',
    title: 'Chuyển sắc thái câu',
    reusableFor: 'Casual, polite, keigo, business Japanese, hội thoại theo vai',
    description: 'Học viên chuyển câu từ thân mật sang lịch sự hoặc kính ngữ bằng các lựa chọn biến đổi.',
    mechanic: 'Đổi câu sang sắc thái yêu cầu',
    signal: 'Đo khả năng chọn mức lịch sự đúng bối cảnh',
    accent: 'violet'
  },
  {
    id: 'kanji-assembly',
    code: 'CN17',
    title: 'Ghép thành phần Kanji',
    reusableFor: 'Bộ thủ, cấu tạo kanji, nhận diện mặt chữ, nghĩa gốc',
    description: 'Khác tập viết: không vẽ nét mà chọn thành phần để lắp thành chữ. Hợp cho nhớ kanji bằng cấu trúc.',
    mechanic: 'Chọn bộ phận để lắp thành chữ',
    signal: 'Biết học viên nhớ kanji bằng cấu trúc hay chỉ nhớ mặt chữ',
    accent: 'ink'
  },
  {
    id: 'minimal-pair',
    code: 'CN18',
    title: 'Nghe cặp âm dễ nhầm',
    reusableFor: 'Trường âm, âm ngắt, âm đục, ら/り/る/れ/ろ, từ đồng âm',
    description: 'Học viên nghe một audio ngắn rồi chọn từ nghe được trong các cặp rất giống nhau. Dạng này tập trung vào lỗi nghe nhỏ nhưng ảnh hưởng nghĩa.',
    mechanic: 'Nghe audio rồi chọn từ đúng',
    signal: 'Chỉ ra nhóm âm học viên hay nhầm',
    accent: 'green'
  },
  {
    id: 'kanji-reading',
    code: 'CN19',
    title: 'Chọn cách đọc Kanji theo ngữ cảnh',
    reusableFor: 'Âm On/Kun, kanji nhiều cách đọc, từ ghép, câu ngắn',
    description: 'Cùng một chữ kanji nhưng cách đọc thay đổi theo từ. Học viên chọn reading đúng cho từng ngữ cảnh thay vì học kanji rời.',
    mechanic: 'Kanji trong từ -> chọn cách đọc',
    signal: 'Phân biệt lỗi nhớ nghĩa và lỗi chọn âm đọc',
    accent: 'orange'
  },
  {
    id: 'particle-map',
    code: 'CN20',
    title: 'Bản đồ trợ từ',
    reusableFor: 'に/へ/で/を, nơi chốn, hướng di chuyển, địa điểm hành động',
    description: 'Hiển thị tình huống dạng bản đồ nhỏ để học viên chọn trợ từ theo quan hệ không gian. Dạng này trực quan hơn trắc nghiệm trợ từ thuần chữ.',
    mechanic: 'Nhìn quan hệ không gian rồi chọn trợ từ',
    signal: 'Biết học viên hiểu sai nơi đến, nơi làm hay hướng đi',
    accent: 'teal'
  },
  {
    id: 'dialogue-branch',
    code: 'CN21',
    title: 'Rẽ nhánh hội thoại',
    reusableFor: 'Kaiwa, phản xạ tình huống, dịch vụ, xin lỗi, từ chối mềm',
    description: 'Học viên chọn câu phản hồi để cuộc hội thoại đi đúng nhánh. Tốt cho luyện giao tiếp vì mỗi lựa chọn tạo hậu quả khác nhau.',
    mechanic: 'Tình huống hội thoại -> chọn phản hồi',
    signal: 'Đánh giá lựa chọn ngôn ngữ theo bối cảnh giao tiếp',
    accent: 'magenta'
  },
  {
    id: 'form-extraction',
    code: 'CN22',
    title: 'Rút thông tin vào biểu mẫu',
    reusableFor: 'Nghe/đọc thông báo, đặt lịch, đặt bàn, điền form nghiệp vụ',
    description: 'Học viên đọc hoặc nghe một đoạn rồi đưa thông tin vào các trường như ngày, giờ, số người. Dạng này gần với tác vụ đời thực.',
    mechanic: 'Đoạn thông tin -> điền các trường form',
    signal: 'Biết trường dữ liệu nào học viên bỏ sót',
    accent: 'mint'
  },
  {
    id: 'nuance-meter',
    code: 'CN23',
    title: 'Đo sắc thái câu nói',
    reusableFor: 'Từ chối, xin lỗi, nhờ vả, cảm ơn, mức độ trực tiếp/gián tiếp',
    description: 'Học viên chọn ý định giao tiếp thật sự của câu. Dạng này giúp học văn hóa ngôn ngữ, không chỉ dịch nghĩa từng từ.',
    mechanic: 'Câu nói -> chọn sắc thái/ý định',
    signal: 'Phát hiện lỗi hiểu literal nhưng sai dụng ý',
    accent: 'rose'
  },
  {
    id: 'counter-unit',
    code: 'CN24',
    title: 'Chọn lượng từ đúng',
    reusableFor: '本/枚/匹/台/人, số đếm, đồ vật, động vật, phương tiện',
    description: 'Học viên nhìn vật hoặc ngữ cảnh rồi chọn lượng từ phù hợp. Dạng này có thể tái dùng cho nhiều bài số đếm.',
    mechanic: 'Vật/ngữ cảnh -> chọn lượng từ',
    signal: 'Biết học viên sai nhóm đồ vật hay sai cách đọc số',
    accent: 'gold'
  },
  {
    id: 'shadow-transcript',
    code: 'CN25',
    title: 'Khôi phục câu nghe được',
    reusableFor: 'Nghe thông báo, nghe hội thoại ngắn, phân biệt chi tiết bị nuốt âm',
    description: 'Học viên nghe một câu rồi chọn transcript khớp nhất trong các câu gần giống nhau. Không phải điền chỗ trống, trọng tâm là nhận diện toàn câu.',
    mechanic: 'Nghe câu -> chọn transcript đúng',
    signal: 'Đo khả năng nghe chi tiết trong câu hoàn chỉnh',
    accent: 'steel'
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

const MinimalPairDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = '切手（きって）';
  const options = ['来て（きて）', '切手（きって）', '聞いて（きいて）'];

  return (
    <div className="demo-panel">
      <button className="audio-button" type="button" onClick={() => speakJapanese('きって')}>
        <span>Nghe: きって</span>
        <WaveBars />
      </button>
      <div className="pair-grid">
        {options.map((item) => (
          <button key={item} type="button" className={choice === item ? 'pair-card pair-card--selected' : 'pair-card'} onClick={() => setChoice(item)}>
            {item}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText={correct} />
    </div>
  );
};

const KanjiReadingDemo = () => {
  const [answers, setAnswers] = useState({});
  const correct = { gakusei: 'せい', umareru: 'う' };
  const done = Object.keys(correct).every((key) => answers[key]);
  const isCorrect = done && Object.entries(correct).every(([key, value]) => answers[key] === value);

  const choose = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="demo-panel">
      {[
        ['gakusei', '学生', ['せい', 'なま', 'い']],
        ['umareru', '生まれる', ['せい', 'う', 'しょう']]
      ].map(([key, word, choices]) => (
        <div className="reading-card" key={key}>
          <strong>{word}</strong>
          <div className="choice-row">
            {choices.map((choice) => (
              <button key={choice} type="button" className={answers[key] === choice ? 'selected-chip' : ''} onClick={() => choose(key, choice)}>
                {choice}
              </button>
            ))}
          </div>
        </div>
      ))}
      <ResultPill state={done ? (isCorrect ? 'correct' : 'wrong') : null} correctText="学生 = がくせい, 生まれる = うまれる" />
    </div>
  );
};

const ParticleMapDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = 'で';

  return (
    <div className="demo-panel">
      <div className="map-board">
        <span className="map-node">駅</span>
        <span className="map-path" />
        <span className="map-node">友だち</span>
      </div>
      <p className="demo-question">駅 ___ 友だちに会います。</p>
      <div className="choice-row">
        {['に', 'へ', 'で', 'を'].map((particle) => (
          <button key={particle} type="button" className={choice === particle ? 'selected-chip' : ''} onClick={() => setChoice(particle)}>
            {particle}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText="駅で友だちに会います" />
    </div>
  );
};

const DialogueBranchDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = 'かしこまりました。少々お待ちください。';

  return (
    <div className="demo-panel">
      <div className="dialogue-stack">
        <p><strong>客:</strong> すみません、もう少し小さいサイズはありますか。</p>
        <p><strong>店員:</strong> ________</p>
      </div>
      <div className="branch-grid">
        {[
          'ないです。',
          'かしこまりました。少々お待ちください。',
          '小さいサイズが好きです。'
        ].map((item) => (
          <button key={item} type="button" className={choice === item ? 'branch-card branch-card--selected' : 'branch-card'} onClick={() => setChoice(item)}>
            {item}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText={correct} />
    </div>
  );
};

const FormExtractionDemo = () => {
  const [fields, setFields] = useState({ date: null, time: null, people: null });
  const correct = { date: '3月12日', time: '19時', people: '2人' };
  const done = Object.values(fields).every(Boolean);
  const isCorrect = done && Object.entries(correct).every(([key, value]) => fields[key] === value);

  const choose = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="demo-panel">
      <div className="message-card">
        3月12日の夜7時に、2人で予約したいです。
      </div>
      <div className="form-grid">
        {[
          ['date', 'Ngày', ['3月10日', '3月12日', '12月3日']],
          ['time', 'Giờ', ['7時', '19時', '9時']],
          ['people', 'Số người', ['1人', '2人', '3人']]
        ].map(([field, label, options]) => (
          <div className="form-field" key={field}>
            <strong>{label}: {fields[field] || '____'}</strong>
            <div className="choice-row">
              {options.map((option) => (
                <button key={option} type="button" className={fields[field] === option ? 'selected-chip' : ''} onClick={() => choose(field, option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ResultPill state={done ? (isCorrect ? 'correct' : 'wrong') : null} correctText="3月12日 / 19時 / 2人" />
    </div>
  );
};

const NuanceMeterDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = 'Từ chối mềm';

  return (
    <div className="demo-panel">
      <div className="register-card">
        <small>Ý thật trong câu là gì?</small>
        <p>今日はちょっと...</p>
      </div>
      <div className="nuance-grid">
        {['Đồng ý ngay', 'Từ chối mềm', 'Đang rất giận'].map((item) => (
          <button key={item} type="button" className={choice === item ? 'nuance-card nuance-card--selected' : 'nuance-card'} onClick={() => setChoice(item)}>
            {item}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText={correct} />
    </div>
  );
};

const CounterUnitDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = '本';

  return (
    <div className="demo-panel">
      <div className="counter-object">
        <span>✎ ✎ ✎</span>
        <strong>えんぴつが3___あります。</strong>
      </div>
      <div className="choice-row">
        {['枚', '本', '匹', '台'].map((counter) => (
          <button key={counter} type="button" className={choice === counter ? 'selected-chip' : ''} onClick={() => setChoice(counter)}>
            {counter}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText="3本" />
    </div>
  );
};

const ShadowTranscriptDemo = () => {
  const [choice, setChoice] = useState(null);
  const correct = '明日の会議は10時からです。';
  const options = [
    '明日の会議は10時からです。',
    '明日の会議は1時からです。',
    '昨日の会議は10時からです。'
  ];

  return (
    <div className="demo-panel">
      <button className="audio-button" type="button" onClick={() => speakJapanese('明日の会議は10時からです。')}>
        <span>Nghe thông báo</span>
        <WaveBars />
      </button>
      <div className="shadow-lines">
        {options.map((line) => (
          <button key={line} type="button" className={choice === line ? 'shadow-line shadow-line--selected' : 'shadow-line'} onClick={() => setChoice(line)}>
            {line}
          </button>
        ))}
      </div>
      <ResultPill state={choice ? (choice === correct ? 'correct' : 'wrong') : null} correctText={correct} />
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
    case 'minimal-pair':
      return <MinimalPairDemo />;
    case 'kanji-reading':
      return <KanjiReadingDemo />;
    case 'particle-map':
      return <ParticleMapDemo />;
    case 'dialogue-branch':
      return <DialogueBranchDemo />;
    case 'form-extraction':
      return <FormExtractionDemo />;
    case 'nuance-meter':
      return <NuanceMeterDemo />;
    case 'counter-unit':
      return <CounterUnitDemo />;
    case 'shadow-transcript':
      return <ShadowTranscriptDemo />;
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
        <div className="challenge-kicker">Cơ chế thử thách tiếng Nhật</div>
        <h1>16 dạng thử thách tương tác cho bài học tiếng Nhật</h1>
        <p>
          Trang này mô phỏng các cơ chế câu hỏi có thể tái sử dụng cho nhiều lesson, từ từ vựng, ngữ pháp, nghe hiểu đến giao tiếp.
          Mỗi dạng tập trung vào cách học viên thao tác, dữ liệu giáo viên nhận được và tình huống nên áp dụng.
        </p>
      </section>

      <section className="challenge-layout" aria-label="Japanese challenge mechanic demos">
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
          </div>

          <div className="showcase-facts" aria-label="Challenge mechanic details">
            <div>
              <small>Cơ chế</small>
              <strong>{activeType.mechanic}</strong>
            </div>
            <div>
              <small>Dùng tốt cho</small>
              <span>{activeType.reusableFor}</span>
            </div>
            <div>
              <small>Tín hiệu học tập</small>
              <span>{activeType.signal}</span>
            </div>
          </div>

          <DemoStage key={activeType.id} activeType={activeType} />

          <div className="reuse-note">
            <strong>Gợi ý triển khai:</strong> có thể dùng như template độc lập, mini-game trong lesson, hoặc câu review sau khi học viên làm sai.
            Ưu tiên ghi lại thao tác trung gian để giáo viên biết lỗi nằm ở đâu, không chỉ biết đúng/sai cuối cùng.
          </div>
        </article>
      </section>
    </main>
  );
};

export default Challenge;
