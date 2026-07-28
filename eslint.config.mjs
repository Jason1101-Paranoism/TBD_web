import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**'] },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    // Astro 的 frontmatter 是 TypeScript。沒有這段，任何寫了型別註記或
    // interface 的 .astro 檔都會直接 "Parsing error: interface is reserved" ——
    // 那不是程式碼有問題，是 linter 根本沒讀懂它。
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: { parser: tsParser, extraFileExtensions: ['.astro'] },
    },
  },
  {
    // 沒有這段，public/js/*.js 裡的 document / window / console 全部會被報成
    // no-undef —— 112 個純誤報。astro.configs.recommended 不會幫你設瀏覽器全域。
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: false }],
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    // eslint-plugin-astro 看不懂 <script is:inline define:vars={{ FOO }}> ——
    // 它會把 Astro 已經正確注入的變數報成 no-undef。純誤報，關掉。
    //
    // 注意第二個 pattern：plugin 用 processor 把 <script> 區塊抽成虛擬檔
    // （形如 foo.astro/1_1.js），所以只寫 '**/*.astro' 匹配不到那些區塊 ——
    // 而報錯的正是那些區塊。
    //
    // 只影響 .astro；public/js/*.js 這類真正的瀏覽器腳本仍保留 no-undef。
    files: ['**/*.astro', '**/*.astro/*.js'],
    rules: { 'no-undef': 'off' },
  },
];
