# ことり — 免費日文學習

ことり是免費、無能量限制的 N5 日文學習軟體。支援 Windows 桌面安裝、瀏覽器和手機 PWA。網頁版可部署到 GitHub Pages；Supabase 提供 email／密碼註冊登入與跨裝置進度同步。

## GitHub Pages 網頁版

專案已附 `.github/workflows/deploy-pages.yml`。將程式推送到 GitHub repository 的 `main` 或 `master` 分支後，GitHub Actions 會建置並部署 `dist/`。到 repository 的 **Settings → Pages** 確認部署來源為 **GitHub Actions**。完成後網址通常是 `https://<帳號>.github.io/<repository>/`。

此專案已連到 Supabase 的 `JAPAN` 專案。前端只包含 Supabase publishable key；它可公開放在網頁中，而個人資料由資料庫的 Row Level Security 保護。絕不可加入 `service_role`／secret key。

接著在 Supabase SQL Editor 執行 [`supabase/migrations/20261110000000_learner_progress.sql`](supabase/migrations/20261110000000_learner_progress.sql)，建立開啟 Row Level Security 的個人進度表。RLS 政策會限制使用者只能讀寫自己的資料。

在 Supabase **Authentication → URL Configuration** 設定：

- Site URL：你的 GitHub Pages 網址，例如 `https://<帳號>.github.io/<repository>/`
- Redirect URLs：同一網址及 `https://<帳號>.github.io/<repository>/**`

若使用自訂網域，請將它也加入 Site URL／Redirect URLs。註冊可使用 Supabase email confirmation；驗證信的回跳位置由網站目前的 Pages 網址產生。

## 本機預覽

```bash
npm install
npm run dev
```

Supabase 已預設連線；如需改接另一個專案，複製 `.env.example` 為 `.env.local`，填入另一個 Project URL 與 publishable／anon key。Windows 桌面程式也可使用相同登入與同步。

## Windows 安裝版

安裝完成後從桌面或開始選單開啟「ことり Japanese Studio」，不需要另外開 CMD。執行 `npm run installer` 可重新產生 Windows 安裝檔。

## N5 學習內容

- 8 個單元、36 堂分章教學課；每堂有解說、日文例句與繁體中文翻譯，再做 5 題練習
- 約 180 個核心 N5 單字、42 個文法重點
- 208 張平假名／片假名、濁音、半濁音與拗音卡片
- 練習涵蓋讀音、寫法、詞義、文法、句子排序、短文、告示資訊和日語語音合成聽力
- 單字、假名、文法間隔複習，錯題可不限次重做；所有課程免費，沒有能量或每日作答上限

JLPT 不再發布固定而完整的詞彙、漢字和文法清單，因此題庫是整理出的 N5 核心內容與練習，不是官方題庫或官方完整詞表。

## 維護者建置

- `npm run build` 產生網頁版到 `dist/`
- `npm run installer` 產生 Windows 安裝檔
