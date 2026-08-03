// 研究所推甄「分學群工具包」的唯一資料來源。
//
// 為什麼存在：這些模板原本各自寫死在五個分學群指南頁裡，`resources/tools.html`
// 則是另一份手寫清單。結果 Week 3–6 落地時只更新了指南頁，tools 頁停在 Week 2，
// 20 份模板在下載頁上消失了四輪都沒人發現。改成同一份資料後，新增一個學群
// 只要在這裡加一組，指南頁與下載頁同時長出來。
//
// 搭配 `scripts/verify.mjs` 的「模板檔案全部出現在 tools.html」測試：
// 有實體檔卻沒登記在這裡，閘門會直接失敗，不會再靜默漏掉。

/**
 * 「學群 → 完整指南」的唯一資料來源。
 *
 * 這份對應原本有三份副本：`ArticleLayout` 的 `GUIDE_BY_DEPT`（麵包屑指南層與
 * series-nav 的橫向出口）、`graduate-application.astro` 的 `GUIDE_BY_TRACK`
 * （對照表欄位標題）、`resources.astro` 的 `staticPages`（搜尋資料）。三份手寫、
 * 沒有任何東西保證它們一致——和 D-003 那 20 份消失的模板是同一類問題，只是還沒爆。
 *
 * 含設計傳播（有指南但沒有模板），所以不能直接用 gradTemplateGroups 代替。
 */
export interface GradGuide {
  /** 對應文章 frontmatter 的 departmentGroup */
  dept: string;
  /** 完整標題，麵包屑與搜尋用 */
  label: string;
  href: string;
  /** 搜尋資料用的一句話說明 */
  desc: string;
}

export const gradGuides: GradGuide[] = [
  {
    dept: '設計傳播',
    label: '設計研究所申請指南',
    href: '/pages/guides/graduate-design.html',
    desc: '設計類群研究所申請七階段：學術型vs實務型選校、研究計畫×作品集、口試講評，含通用與設計專屬文章地圖。',
  },
  {
    dept: '理工',
    label: '理工研究所申請指南',
    href: '/pages/guides/graduate-engineering.html',
    desc: '理工類群研究所申請七階段：大二暑假起跑的時程、選實驗室、技術匹配研究計畫、備審與口試答辯，附五份下載模板。',
  },
  {
    dept: '生醫',
    label: '生醫與公衛研究所申請指南',
    href: '/pages/guides/graduate-biomed.html',
    desc: '生醫與公衛類群研究所申請七階段：雙軌時程、選實驗室、可行性研究計畫書、研究誠信備審與研究限制答辯，附五份下載模板。',
  },
  {
    dept: '商管財經',
    label: '商管與財經研究所申請指南',
    href: '/pages/guides/graduate-business.html',
    desc: '商管與財經類群研究所申請七階段：經歷整合時程、選校所定位、可研究的問題、商業故事線備審與綜合能力口試，附五份下載模板。',
  },
  {
    dept: '人文社科',
    label: '人文與社會科學研究所申請指南',
    href: '/pages/guides/graduate-humanities.html',
    desc: '人文社科類群研究所申請七階段：文獻與初稿期時程、學術傳統選所、問題意識與文獻對話、文字作品備審與研究計畫答辯，附五份下載模板。',
  },
  {
    dept: '藝術',
    label: '藝術研究所申請指南',
    href: '/pages/guides/graduate-arts.html',
    desc: '藝術類群研究所申請七階段：作品集與母題時程、工作室與創作取向選所、創作研究計畫、作品集備審與作品答辯，附五份下載模板。',
  },
];

/** dept → { href, label }，給需要查表的地方用 */
export const gradGuideByDept: Record<string, { href: string; label: string }> =
  Object.fromEntries(gradGuides.map((g) => [g.dept, { href: g.href, label: g.label }]));

export interface GradTemplate {
  title: string;
  desc: string;
  /** 檔名主幹，實體檔為 public/assets/templates/<file>.{md,csv} */
  file: string;
  /** 使用說明所在的文章 */
  article: string;
}

export interface GradTemplateGroup {
  /** 對應文章 frontmatter 的 departmentGroup */
  dept: string;
  /** 下載頁分組標題用 */
  label: string;
  /** 該學群的完整指南 */
  guide: string;
  templates: GradTemplate[];
}

export const gradTemplateGroups: GradTemplateGroup[] = [
  {
    dept: '理工',
    label: '理工',
    guide: '/pages/guides/graduate-engineering.html',
    templates: [
      {
        title: '教授與實驗室比較表',
        desc: '研究資源、指導風格、畢業去向逐項比較，把選所收斂成一張表。',
        file: 'grad-engineering-lab-compare',
        article: '/pages/resources/engineering-graduate-choose.html',
      },
      {
        title: '理工套磁信結構模板',
        desc: '六段信件結構＋寄信前檢核：用專題成果證明契合度，不是表達熱情。',
        file: 'grad-engineering-contact-email',
        article: '/pages/resources/graduate-contact-professor.html#stem-tips',
      },
      {
        title: '理工研究計畫書架構模板',
        desc: '七節架構，每節附「要回答的問題」與檢查點，含常見失分寫法。',
        file: 'grad-engineering-proposal-framework',
        article: '/pages/resources/engineering-graduate-proposal.html',
      },
      {
        title: '理工備審資料 Checklist',
        desc: 'CV、自傳、專題成果與整體一致性，逐項勾完再送件。',
        file: 'grad-engineering-portfolio-checklist',
        article: '/pages/resources/engineering-graduate-cv.html',
      },
      {
        title: '理工口試自我檢核表',
        desc: '簡報、數據答辯、追問應對與行政準備，上場前的完整檢核。',
        file: 'grad-engineering-oral-checklist',
        article: '/pages/resources/engineering-graduate-oral.html',
      },
    ],
  },
  {
    dept: '生醫',
    label: '生醫與公衛',
    guide: '/pages/guides/graduate-biomed.html',
    templates: [
      {
        title: '教授與實驗室評估表',
        desc: '研究方向、樣本與設備資源、指導風格、失敗容忍度、畢業去向逐項比較，把選所收斂成一張表。',
        file: 'grad-biomed-lab-compare',
        article: '/pages/resources/biomed-graduate-choose.html',
      },
      {
        title: '生醫套磁信結構模板',
        desc: '六段信件結構＋能力證據清單＋寄信前檢核：用技術即戰力證明契合度，並依教授類型調整切入點。',
        file: 'grad-biomed-contact-email',
        article: '/pages/resources/graduate-contact-professor.html#biomed-tips',
      },
      {
        title: '研究計畫可行性檢核表',
        desc: '十節架構＋生醫與公衛各自的檢核點，含 IRB／IACUC、對照設計、偏差與備援方案。',
        file: 'grad-biomed-proposal-framework',
        article: '/pages/resources/biomed-graduate-proposal.html',
      },
      {
        title: '生醫備審 Checklist',
        desc: '學術 CV 欄位、技術清單具體化、專題誠實呈現與一致性，逐項勾完再送件。',
        file: 'grad-biomed-portfolio-checklist',
        article: '/pages/resources/biomed-graduate-cv.html',
      },
      {
        title: '生醫口試自我檢核表',
        desc: '三分鐘說明、四類追問、面對不會的問題與研究誠信，上場前的完整檢核。',
        file: 'grad-biomed-oral-checklist',
        article: '/pages/resources/biomed-graduate-oral.html',
      },
    ],
  },
  {
    dept: '商管財經',
    label: '商管與財經',
    guide: '/pages/guides/graduate-business.html',
    templates: [
      {
        title: '校所與教授比較表',
        desc: '系所定位、課程與研究方法、教授方向、產學資源、校友去向逐項比較，把選校收斂成一張表。',
        file: 'grad-business-school-compare',
        article: '/pages/resources/business-graduate-choose.html',
      },
      {
        title: '商管財經套磁信結構模板',
        desc: '七段信件結構＋適合呈現的能力證據清單＋寄信前檢核，避免寫成群發罐頭信。',
        file: 'grad-business-contact-email',
        article: '/pages/resources/graduate-contact-professor.html#business-tips',
      },
      {
        title: '研究問題拆解與可行性檢核表',
        desc: '問題拆解五步＋十節架構＋方法選用對照＋常見失分點，把熱門議題收斂成做得完的題目。',
        file: 'grad-business-proposal-framework',
        article: '/pages/resources/business-graduate-proposal.html',
      },
      {
        title: '商管財經備審 Checklist',
        desc: '經歷盤點表、CV 欄位、每段經歷該寫出的七件事、自傳與五份文件分工，逐項勾完再送件。',
        file: 'grad-business-portfolio-checklist',
        article: '/pages/resources/business-graduate-cv.html',
      },
      {
        title: '商管財經口試自我檢核表',
        desc: '一分鐘說明、四類題型、個案與時事兩個答題框架、面對不會的問題五步，上場前完整檢核。',
        file: 'grad-business-oral-checklist',
        article: '/pages/resources/business-graduate-oral.html',
      },
    ],
  },
  {
    dept: '人文社科',
    label: '人文與社會科學',
    guide: '/pages/guides/graduate-humanities.html',
    templates: [
      {
        title: '校所、學術傳統與教授比較表',
        desc: '學術傳統、偏重時期與區域、方法課程、館藏與資料庫、教授取徑逐項比較，把選校收斂成一張表。',
        file: 'grad-humanities-school-compare',
        article: '/pages/resources/humanities-graduate-choose.html',
      },
      {
        title: '人文社科聯繫教授信結構模板',
        desc: '先判斷該不該寄的兩組條件，再用七段信件結構寫，最後八項寄信前檢核，避免寫成群發罐頭信。',
        file: 'grad-humanities-contact-email',
        article: '/pages/resources/graduate-contact-professor.html#humanities-tips',
      },
      {
        title: '研究問題形成與文獻對話整理表',
        desc: '問題收斂五步＋十節架構＋文獻對話表＋範圍與可行性檢核，把興趣變成做得完的研究問題。',
        file: 'grad-humanities-proposal-framework',
        article: '/pages/resources/humanities-graduate-proposal.html',
      },
      {
        title: '文字作品選件與備審 Checklist',
        desc: '作品選件十項評分、學術 CV 十二欄位、自傳要素與五份文件分工，逐項勾完再送件。',
        file: 'grad-humanities-portfolio-checklist',
        article: '/pages/resources/humanities-graduate-cv.html',
      },
      {
        title: '研究計畫口試答辯檢核表',
        desc: '四類追問題庫、五步答題框架、面對反對意見的句型與三個預期質疑，上場前完整檢核。',
        file: 'grad-humanities-oral-checklist',
        article: '/pages/resources/humanities-graduate-oral.html',
      },
    ],
  },
  {
    dept: '藝術',
    label: '藝術',
    guide: '/pages/guides/graduate-arts.html',
    templates: [
      {
        title: '教授、工作室與系所比較表',
        desc: '創作取向、教授近年創作、工作室設備與使用限制、指導方式、展覽資源逐項比較，把選校收斂成一張表。',
        file: 'grad-arts-school-compare',
        article: '/pages/resources/arts-graduate-choose.html',
      },
      {
        title: '藝術類群聯繫教授信結構模板',
        desc: '先判斷該不該寄的兩組條件，再用七段信件結構寫，最後八項寄信前檢核，避免寫成只有稱讚的罐頭信。',
        file: 'grad-arts-contact-email',
        article: '/pages/resources/graduate-contact-professor.html#arts-tips',
      },
      {
        title: '創作母題發展與研究計畫模板',
        desc: '作品盤點與母題辨認表＋十節計畫提綱＋製作可行性檢核，讓計畫從既有作品長出來而不是另外拼一份。',
        file: 'grad-arts-proposal-framework',
        article: '/pages/resources/arts-graduate-proposal.html',
      },
      {
        title: '作品集選件與備審 Checklist',
        desc: '選件十項評分、作品說明八欄位、藝術 CV 十一欄位與五份文件分工，逐項勾完再送件。',
        file: 'grad-arts-portfolio-checklist',
        article: '/pages/resources/arts-graduate-cv.html',
      },
      {
        title: '口試作品答辯檢核表',
        desc: '四類追問題庫、五步答題框架、一分鐘創作主張與面對反對意見的句型，上場前完整檢核。',
        file: 'grad-arts-oral-checklist',
        article: '/pages/resources/arts-graduate-oral.html',
      },
    ],
  },
];

/** 指南頁與下載頁共用的渲染形狀：把 file 展開成兩個實際下載路徑 */
export function templateLinks(t: GradTemplate) {
  return {
    title: t.title,
    desc: t.desc,
    md: `/assets/templates/${t.file}.md`,
    csv: `/assets/templates/${t.file}.csv`,
    article: t.article,
  };
}

/** 取單一學群的模板（分學群指南頁用） */
export function templatesFor(dept: string) {
  return (gradTemplateGroups.find((g) => g.dept === dept)?.templates ?? []).map(templateLinks);
}
