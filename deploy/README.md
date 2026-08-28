# 部署文档

evals.zenheart.site 的部署由 GitHub Actions 全自动完成（`.github/workflows/build-epub.yml`）。

## 流程

```
push to main
  → CI: validate
  → CI: preprocess
  → CI: build evals.epub
  → CI: build web dist/
  → CI: push to gh-pages branch
  → CI (optional): sync to Aliyun OSS
```

## 域名

- 主域：`evals.zenheart.site`
- DNS：在域名解析商将 `evals` CNAME 指向 `<owner>.github.io`
- 阿里云 CDN（可选）：将 `evals.zenheart.site` CNAME 指向 OSS bucket 的 CDN 加速域名

## GitHub Pages 启用

1. GitHub 仓库 → Settings → Pages
2. Source: `gh-pages` branch
3. Custom domain: `evals.zenheart.site`
4. Enforce HTTPS: 勾选

## 阿里云 OSS 同步（可选）

需要在 GitHub 仓库 Settings → Secrets 配置以下 secret：

| Secret | 说明 |
|---|---|
| `ALIYUN_ACCESS_KEY_ID` | RAM 子账号 AccessKey ID |
| `ALIYUN_ACCESS_KEY_SECRET` | RAM 子账号 AccessKey Secret |
| `ALIYUN_OSS_BUCKET` | OSS bucket 名称（如 `evals-zenheart`） |
| `ALIYUN_OSS_ENDPOINT` | OSS endpoint（如 `oss-cn-hangzhou.aliyuncs.com`） |

### 创建只读 + 写 bucket 权限的 RAM 子账号

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:PutObject",
        "oss:PutObjectAcl",
        "oss:GetObject"
      ],
      "Resource": [
        "acs:oss:*:*:evals-zenheart",
        "acs:oss:*:*:evals-zenheart/*"
      ]
    }
  ]
}
```

### CDN 配置

- CDN 加速域名：`cdn.evals.zenheart.site` 或直接 `evals.zenheart.site`
- 回源 OSS bucket
- HTTPS 证书
- 缓存策略：HTML 5 分钟，EPUB/Cover 30 天，CSS/JS 30 天

## 本地预览

```bash
npm run build:web
npx serve dist
# 打开 http://localhost:3000
```

## 故障排查

### CI 失败：validate

```bash
npm run validate
# 按报错修正 chapter 编号或链接
```

### CI 失败：build-epub

```bash
npm run preprocess
npm run build:epub:official
# 检查 evals.epub 能否用 Calibre / Apple Books 打开
```

### 部署后样式丢失

检查 `dist/styles.css` 是否在 commit 内，并确认 `.nojekyll` 文件存在（`gh-pages` 根目录）。
