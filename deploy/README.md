# 部署文档

evals.zenheart.site 的部署由 GitHub Actions 全自动完成：`.github/workflows/build-epub.yml`。

## 流程（当前真实链路）

```
push to main（PR 仅构建不部署）
  → CI: node book/validate.js          # 书籍结构门禁
  → CI: data 层校验（脚本存在时执行）
  → CI: preprocess + build evals.epub
  → CI: node scripts/build-web.mjs     # 生成 dist/（书籍 + 评估大全 + 详情页）
  → CI: node scripts/validate-site.mjs # 站点门禁（封面/交叉引用/schema/链接/隐私）
  → upload artifacts（evals-epub / evals-web）
  → deploy job（仅 main）：
      mkdir _site
      cp evals.epub → _site/
      cp -r dist/* → _site/
      echo "evals.zenheart.site" > _site/CNAME
      touch _site/.nojekyll
      actions/deploy-pages 上传
```

Source 是 **GitHub Actions（deploy-pages）**，不是 gh-pages 分支；无 OSS/CDN 同步步骤。

## 域名

- 自定义域：`evals.zenheart.site`（由部署时的 `CNAME` 文件声明）
- DNS：在域名解析商将 `evals` CNAME 指向 `<owner>.github.io`
- HTTPS：仓库 Pages 设置中 Enforce HTTPS

## GitHub Pages 设置

1. GitHub 仓库 → Settings → Pages
2. Source: **GitHub Actions**
3. Custom domain: `evals.zenheart.site`（如未自动带上，手动填一次）

## 本地预览

```bash
npm run build          # validate → EPUB → web → validate:site
npx serve dist         # 或 npx http-server dist
```

## 故障排查

### CI 失败：book/validate.js

```bash
npm run validate
# 按报错修正章节编号、标题层级或链接
```

### CI 失败：validate-site

```bash
npm run validate:site
# 常见：封面章数与 metadata 不一致 / 交叉引用旧编号 / dist 内部死链
# 修复源文件（book/ data/ scripts/）后重新构建，不要手改 dist/
```

### 部署后样式丢失

`.nojekyll` 由部署步骤自动写入 `_site/`；确认 deploy job 没被跳过（只有 main push 触发部署）。
