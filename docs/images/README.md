# 截图 / GIF 放这里

README 顶部的截图是涨 star 的**头号转化点**。GitHub 用户扫一眼图就决定要不要 star,文字列表没人读。请按下表补齐。

在线站点:https://keyuchen-del.github.io/AI-Search/

## 需要哪几张

| 文件名 | 内容 | 建议尺寸 | 用在哪 |
|--------|------|---------|--------|
| `screenshot-home.png` | **首页**(分类导航 + 资讯列表 + 搜索框,要满屏有料) | 宽 1280px | README 顶部 hero + 预览区 |
| `screenshot-daily.png` | **AI 日报**页(展示主编点评 + 分类摘要) | 宽 1280px | 预览区 |
| `demo.gif` | **30 秒操作录屏**:切分类 → 搜索关键词 → 打开日报 | 宽 ≤1000px,≤8MB | README 顶部(比静态图更吸引人) |
| `banner.png`(可选) | 项目 banner / logo 横幅 | 宽 1280px | 最顶部 |

## 怎么录

- **静态截图**:Mac 按 `Cmd+Shift+4` 框选;或浏览器 DevTools 设备模式截整页。截前把窗口拉到 ~1280px 宽,内容铺满更好看。
- **GIF**:用 [Kap](https://getkap.co/)(Mac,免费)或 [LICEcap](https://www.cockos.com/licecap/) 录屏导出 GIF。控制在 8MB 内,否则 README 加载慢。GIF 太大可上传到 issue 评论拿到永久链接再引用。

## 放进来之后

1. 把图片拖进本目录 `docs/images/`
2. 打开根目录 `README.md` 和 `README.en.md`,**取消顶部 hero 和「界面预览」区那几行 HTML 注释**(`<!-- ... -->`)
3. 提交推送即可,GitHub 会自动渲染

> 提示:`docs/` 目录不会被 GitHub Pages 部署(站点产物在 `out/`),放图不影响线上站点。
