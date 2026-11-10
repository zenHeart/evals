@@@coverCard
type = "video"
date = "2026年11月4日"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110219294526_20bbdf2a313c4cad81b3fdb22932e7ff.mov?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793618987;2108978987&q-key-time=1793618987;2108978987&q-header-list=&q-url-param-list=&q-signature=7b331fb3eec1fdd37e468ac2348a8fdfd77b1406"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110219302736_cb6bad8aa277cf9d40dc98cfa2d4ad3a.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793619030;2108979030&q-key-time=1793619030;2108979030&q-header-list=&q-url-param-list=&q-signature=150aa51ca6edd06bbe479a9f85ee8bab9b9ade49"
image_alt = "hy4PreviewBg"
title = "Hy4 正式发布"
aspectRatio = ""
mediaWidth = "100%"
mediaMarginTop = "32"
mediaMarginBottom = "64"
videoLoop = 0
@@@

@@@space
height = 16
@@@

@@@buttonGroupCard

[[buttons]]
text = "腾讯云"
icon = "tencentcloud"
url = "https://console.cloud.tencent.com/tokenhub/models/detail?modelId=hy4"

[[buttons]]
text = "OpenRouter"
icon = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026070622081339_db7b4e83c4ccd253de47d27e656c6a1f.svg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1783346895;2098706895&q-key-time=1783346895;2098706895&q-header-list=&q-url-param-list=&q-signature=44a94d95270276ae213ffe4696b88387477b9592"
url = "https://openrouter.ai/tencent/hy4"

[[buttons]]
text = "Hy AI Studio"
icon = "hunyuan"
url = "https://aistudio.tencent.com/"

@@@

@@@space
height =32
@@@
今天，我们发布 Hy4 正式版。随着模型能力的再次全面跃升，Hy 首次跻身最强开源模型之列。

相比于 Hy4 preview，Hy4 显著扩展了预训练和后训练规模，首次引入了视觉能力，并大幅提升了指令遵循、长文理解、长程任务、深度研究等各项综合能力。


![Bench1-Hy4-最终版.jpg](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110401013020_30459ea6ad87f74409dbcde1801ac193.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793725295;2109085295&q-key-time=1793725295;2109085295&q-header-list=&q-url-param-list=&q-signature=1537f5ba6511988b1a9c8a1c95047c8c2be99d8f)

# 持续解锁的真实生产力
基础能力的全面提升，以及和腾讯内部众多产品与业务的持续合作，让 Hy4 解锁更多真实生产力场景。

## 视觉与电脑任务
Hy4 首次引入视觉能力，可以结合感知、推理和工具调用，进行细粒度图像处理和复杂图表分析等任务。Hy4 也首次支持电脑操作，可以灵活地结合使用命令行和图形界面。我们针对 Blender、CAD 等专业软件和跨应用长程任务开展了专项训练，持续优化专业任务的规划与执行力。

@@@mediaGallerySwiper
[[items]]
title="卫星图定位"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402241719_cbc261f7a4ebd1078c12234b5b2082e5.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730266;2109090266&q-key-time=1793730266;2109090266&q-header-list=&q-url-param-list=&q-signature=100acac42bdf9c5cdc04710d58d50fd208a7856f"
description="Prompt: 找到屋顶写有“KLOOSTERBOER” 的仓库右上方光伏板区里最东侧的白色方形构件。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320193017_6fca5cb13718f18acb31665150b1b734.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793708370;2109068370&q-key-time=1793708370;2109068370&q-header-list=&q-url-param-list=&q-signature=84b3cddec16813b23799fb81233bcbc30c0666ed"

[[items]]
title="跨软件 DIY 装修"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402252341_842419f99cd9fe38a44d51acdfde97dd.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730336;2109090336&q-key-time=1793730336;2109090336&q-header-list=&q-url-param-list=&q-signature=d2cd3384b4413b22157fb2d2c84bf5782366d06e"
description="Prompt: 参考这张图纸使用mcp在blender中搭建还原整个建筑的室内空间。资产可以使用插件中的cc0资产，如果找不到对应的就自己制作。尽可能制作真实的效果图的材质、光照、色彩和结构。把blender的这个场景导出模型贴图并导入UE里并还原场景布置和灯光效果，导出前需要把模型该合并的合并，比如地面的砖块需要合并成一个，盆栽的植被需要合并成一个，来简化导入导出的流程以及保证引擎内的优化。在UE关卡中增加第一人称预览玩法，可以选中室内的主要元素比如墙体、桌椅等，并且更换他的材质。最终的结果是玩家可以在室内自由的DIY屋内的装修。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320245856_df72b7ce4b0fc63bf4b0ca0fe1f021c8.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793708698;2109068698&q-key-time=1793708698;2109068698&q-header-list=&q-url-param-list=&q-signature=b6491f4115a63bc33bec45a4c7907de10b216060"


[[items]]
title="复杂视觉推理"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402204140_adc2c3e4b4bd7553c6e5a985f03e16ae.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730050;2109090050&q-key-time=1793730050;2109090050&q-header-list=&q-url-param-list=&q-signature=0b20c88e19fdf154cdd25ef6e735736bccf555c3"
description="Prompt: 请仅根据此图，将900块碎片还原成30×30的完整拼图。不搜索网页、本地原图或答案；原始文件夹只读，生成文件写入工作区。简要规划后直接执行，可编写脚本。\n1. 使用原始分辨率分割并编号，核对碎片数量，保留原始像素、轮廓和对应关系。保持实际比例，图像与掩膜同步变换，正确处理 RGB/BGR，避免偏色。\n2. 先抽样验证处理结果和初始拼接，再逐步扩展。结合相邻内容与整体布局判断，保留歧义候选；冲突时复查早期连接，允许拆分回退。复用有效结果，停滞时定位原因，避免盲目重算。\n3. 在接缝处理前独立核验：每块恰用一次、网格完整、位置无冲突。程序检查全部邻接，查看整图和可疑接缝，针对异常修正；填满网格不等于拼对。\n交付完整分辨率PNG、预览图及碎片位置。完成还原并展示结果，确认颜色和整体朝向正确；仍有无法确定的位置，请明确指出。\n图片路径：/Users/Hunyuan/input.png"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320192758_af91e44d61013dd42ab8a4c2ee11a7b6.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793708370;2109068370&q-key-time=1793708370;2109068370&q-header-list=&q-url-param-list=&q-signature=164ac03d2d6b1fe84be12ff07f2d6cae0eaf5549"

[[items]]
title="地理位置查找与定位"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110410593420_e37ea10d777a257997ae9473d272b0a0.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793761184;2109121184&q-key-time=1793761184;2109121184&q-header-list=&q-url-param-list=&q-signature=55664d43ef6c019c2997ad218f7120cc09f79d38"
description="Prompt: 这是哪个城市？拍摄位置在哪？"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110413513156_ff74402f600c13aeda6d0a2b7bd60ad0.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793771495;2109131495&q-key-time=1793771495;2109131495&q-header-list=&q-url-param-list=&q-signature=1c3885b4130c8ad79c5facee39bcd1007c96ee0f"

[[items]]
title="混元表情包"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402212573_eb29f215f10f83188b0499a90e20dc46.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730090;2109090090&q-key-time=1793730090;2109090090&q-header-list=&q-url-param-list=&q-signature=0f73fa54197700fca369afae474aa0380754c17e"
description="Prompt: 用Chrome里的JS Paint（jspaint.app）只靠鼠标画出hy.png，并把每个鼠标动作和画面变化录成视频。\n要求：Playwright全程录屏并显示光标；画布拖成512×460；Lab聚类取含白28色，在Edit Colors里只用鼠标点色域和亮度条调色；方头画笔8/5/2px三遍由粗到细，每遍读回画布，按格子增益合并成直线笔触；JS只读不写画布。\n输出output/：全程与8倍速MP4、记录每次move/down/up的日志、成画、对比图；像素吻合≥95%。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320245727_3e405a906c58c2672f0498eaf6b45cc4.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793708698;2109068698&q-key-time=1793708698;2109068698&q-header-list=&q-url-param-list=&q-signature=4820a12bb93d1160a502ac2d70edcdc71aad08b4"




@@@

@@@space
height = 56
@@@

## 前端与游戏开发
视觉理解的引入也使 Hy4 的前端与游戏开发能力显著提升。我们对前端的复杂交互、业务逻辑、状态管理、前后端联动等方面进行了针对性优化，模型生成的界面不仅好看，并且功能完整可用。在游戏开发场景，我们与腾讯 IEG 专业游戏开发者合作，持续优化数据和评测质量，重点提升了功能实现、玩法逻辑、状态理解、资产处理等能力，实现了对 UE、Unity、Godot 等主流引擎的深度适配，并开始扩展至多人联机游戏开发。相比 Hy4 preview，Hy4 在 GameDev 和 GameLogic 评测中分别提升 19.1% 和 9.8%。

@@@mediaGallerySwiper
[[items]]
title="腾讯企鹅岛"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402280682_ae0c264bdd0ebafc03c67a3fa41e13e6.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730502;2109090502&q-key-time=1793730502;2109090502&q-header-list=&q-url-param-list=&q-signature=24bc68e62be985759c74611f8c5ba1ca8922bfe5"
description="Prompt: 目标：用 Three.js 构建一个「腾讯企鹅岛 3D 数字沙盘」，交付一个可离线双击打开的单文件 HTML（内联 Three.js 0.184.0，无 CDN/字体/纹理等远程依赖）。不是鸟瞰图、不是纵向 Landing Page、不是贴图背景——所有建筑、道路、绿脊、海岸、植被、人车必须在同一套真实三维场景里，可任意旋转与地面行走。\n\n场地：海湾半岛南北纵深，蓝灰海面、白银建筑群、中央绿脊、环岛路网。重点塑造五组建筑——① 腾云中心：三座低矮云楼＋架空筒体＋钢桁架连桥；② 云海大厦：六栋错落塔楼＋参数化金属翼片；③ 企鹅公寓：11 栋锯齿错位、共享退台；④ 腾讯螺旋（最关键）​：四片建筑立面自身连续回旋、展宽向上成塔，落成 J 形收脚，绝不能套外挂圆环或做成四根麻花；⑤ 科技馆：连续环形绿顶＋内庭（标注\"图像拟合、非测绘\"）。\n\n交互：轨道观察、第一/三人称地面漫游（第三人称显示企鹅化身）、天气昼夜、小地图、建筑详情、楼层剖切、电影导览、截图与录制。\n\nUI：浅色磨砂控制面板、中文清晰排版、可收起工具层；夜景只改 3D 环境，面板保持浅色可读，禁止黑底霓虹驾驶舱。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320005933_0129832274e3aabfb6200975a2687bc7.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793707262;2109067262&q-key-time=1793707262;2109067262&q-header-list=&q-url-param-list=&q-signature=f945b083bac3557c5ac3689a09380ad714688c39"

[[items]]
title="电动飞行汽车"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402272082_97d8e3f11949773781b3140fd95ce9ce.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730452;2109090452&q-key-time=1793730452;2109090452&q-header-list=&q-url-param-list=&q-signature=e04d7a0867e6a9a420d5d461757274d5ecacaec5"
description="Prompt: 生成一个以 Tesla Roadster 发布会「垂直弯道」测试 为视觉核心的网页。网页不是传统纵向 Landing Page，而是一个占满浏览器视口的、带有夜间试验场 3D 场景、真实车辆动力学、多车型可选、转播遥测 HUD 与坠毁残骸模拟的互动测试台。\n请重点还原：\n	夜间发布会试验场：泛光灯塔 + 体积光束、LED 大屏、看台手机灯、远山与地平线灯火\n	直道 → 回旋线 → R 10.5 m 圆弧、终止于 170° 的钢桁架垂直弯道\n	五台可选车型，默认 Tesla Roadster（2026 量产设计）\n	按官方侧视 / 俯视图标定的程序化高还原车模\n	W 前进 / S 倒车，真实纵向动力学与抓地极限\n	每一步实时计算法向力：速度不够就脱离坠落，入弯太快就结构过载\n	Roadster：风扇吸附倒挂 170°；冲顶后冷气推进器翻正 + 减速落地\n	小鹏汇天陆地航母：脱离后尾舱开启，飞行体升起展开六旋翼平稳降落\n	动力不足或操控失误即坠毁：残骸翻滚、车轮脱落、碎片四溅、火光与持续黑烟\n	转播遥测风格 HUD：速度表、下压力、俯仰、高度、g 值、姿态仪、贴附窗口曲线\n	入弯限速提示与超速红色警告\n	整体高级、克制，像一场真实的发布会直播，而不是卡通游戏 UI\n一、页面结构\n整个网站只有一个全屏 3D 场景，所有 UI 都是浮在场景上方的 HUD 层：\n	Loading 遮罩（BUILDING TEST SITE）\n	主场景：夜间试验场 + 垂直弯道 + 车辆\n	顶栏、左栏（选车 / 参数 / 任务）、右栏（遥测）、底部仪表\n	结果卡（PASS / CRASH）与「原理」弹层\n不要制作传统 Header + Hero + Section + Footer 的网页。\n整个体验保持：\n100vw × 100vh\ncanvas: position: fixed; inset: 0\nhtml, body: overflow: hidden\n键盘与触控只用于驾驶和切换，不产生任何页面滚动。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320012269_711abfd18182d627066f8ecaf5069256.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793707284;2109067284&q-key-time=1793707284;2109067284&q-header-list=&q-url-param-list=&q-signature=d57469d03ad81577dd974b3b79940e3f32aee0fd"


[[items]]
title="教育场景"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110414072783_cac59b91d4bd7f134da2185763512223.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793772453;2109132453&q-key-time=1793772453;2109132453&q-header-list=&q-url-param-list=&q-signature=9ef07784d891176c430739e048dd9a09f2a629ad"
description="Prompt: Clipboard_Screenshot.png 参考这张图做成一个精美的3D 交互讲解网页，只交付一个 .html 文件，\n# 背景要求\n星空背景，旁边是讲解面板。点模型上的标签，就能看到这个结构是什么、有什么用、考试怎么考；支持剖面、拆解、多个对象并排对比，还能对照原图。\n# 3D 建模要求\n## 大肠杆菌\n- 杆状菌体，带有剖切开口，可以看到内部结构。\n- 由外到内依次建模，每层颜色可区分：\n细胞壁（橙黄，不透明）→ 细胞膜（绿色薄层）→ 细胞质（淡蓝、半透明）。\n- 拟核：用多条随机缠绕的 TubeGeometry 组成蓝色 DNA 团。\n- 核糖体：100～200 个紫色小球，随机分布在细胞质中。\n- 菌毛：50～80 根短细管，沿表面法线方向分布。\n- 鞭毛：3～5 根波浪形长管，从一端伸出。\n## 蓝细菌\n- 椭球形细胞，同样做剖切展示。\n- 细胞壁为外层深青色颗粒质感厚壳，内侧是细胞膜。\n- 细胞质为绿色，内含 4～6 层同心排列的光合片层，片层上分布黑色小点表示核糖体。\n- 中央拟核区由网状丝线和若干黄色颗粒组成。\n# 美观度\n科普讲解注意美观度，通过3D展示便于学生理解"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110321521289_4b9f2cef912ae812c2d398de4ecf0223.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793713935;2109073935&q-key-time=1793713935;2109073935&q-header-list=&q-url-param-list=&q-signature=6c7530c3ff9aad3ec7848974fc2f24353d1046b3"

[[items]]
title="求生之路"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110413530825_f877f029d0c211140ea394e7b53c8360.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793771594;2109131594&q-key-time=1793771594;2109131594&q-header-list=&q-url-param-list=&q-signature=45a061bc09127cd8ab4234a9fd09c347700bc885"
description="Prompt: 用Hyper引擎制作一款第三人称射击游戏，你先在一个简单的只有地板和四面高墙的场景中实现TPS游戏的3C，可以通过数字键1234切换匕首、手枪、步枪、霰弹枪。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320063732_a641eac3edab8c9ea9206861a94fbbdf.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793707599;2109067599&q-key-time=1793707599;2109067599&q-header-list=&q-url-param-list=&q-signature=2d8f411c264a2512347f4cbddb8ad82584f67169"



[[items]]
title="QQ 街机"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402305312_aba05a75e2c776106a9e75f30324fed5.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730671;2109090671&q-key-time=1793730671;2109090671&q-header-list=&q-url-param-list=&q-signature=87a5fa394693957a7c09d943c4c1e6f3d20a648d"
description="Prompt: 请制作一个可实际游玩的「QQ 欢乐街机厅」：把 2000 年代 QQ 游戏大厅装进一间精致的 3D 街机房。打开后先看到完整大厅，点击圆凳入座，镜头推近机台，再在屏幕里选择和游玩小游戏。要有怀旧气氛、丰富画面和完整交互，不是静态展示页。\n\n一、整体视觉\n主题是「2003 年的 QQ 游戏记忆」：热闹、亲切、明亮，带一点玩具模型和微缩场景的质感。\n房间采用奶油黄墙面、深蓝天花、蓝黄棋盘格地砖，暖黄色灯光搭配蓝、橙、绿、紫色机台。\n机身有圆润倒角、厚实外壳、烤漆高光和少量镀铬装饰。地面有柔和反射，物件落地处有接触阴影。\n灯箱和霓虹适度发光，但文字、屏幕和机身颜色仍然清楚。不要做成暗黑赛博房间或现代极简界面。\n\n二、大厅与机台\n默认镜头正对房间，略带俯视，能看到地面和机台纵深。中央主机最大、最醒目，左右各两台侧机，五台屏幕都能看到。\n中央主机采用蓝白配色：顶部「QQ游戏」灯箱、厚屏框和 4:3 屏幕、前凸操控台、红色摇杆、彩色实体按钮、下方投币口和橙色脚座。造型有层次，不要只用长方体拼柜子。\n主机顶上放企鹅雕像：黑白身体、奶白肚皮、黄色嘴脚、红围巾、闭眼笑，一只鳍抬起招手，另一只自然下垂。鳍是扁薄的片状，轮廓柔和。\n四台侧机分别是橙色 QQ堂、绿色连连看、紫色音乐节奏机、绿色斗地主。每台都有独立灯箱、动态待机画面、投币区和圆凳。\n凳子采用蓝紫色软垫和金属凳腿，鼠标悬停时给出清楚的可入座反馈。\n房间加入「QQ 欢乐街机厅 · 2003」招牌、吊灯、气球、企鹅摆件架、娃娃机、好友在线榜、今日高手榜和游戏海报。陈设丰富但有主次，不挡住主机屏幕。\n\n三、屏幕里的游戏大厅\n使用早期桌面客户端的视觉语言：蓝色渐变标题栏、菜单和工具栏、宋体小字、细边框、亮面按钮、橙色活动横幅。\n布局包含左侧游戏分类和用户资料、中间游戏专区与动态预览、下方桌子座位列表，以及好友在线和聊天消息。\n内容密集但整齐，不要用四张大卡片占满屏幕。\n四款游戏的预览展示真实玩法动画。点击游戏条目、预览区或空座位都能开始，键盘也能选择和确认。\n暂停、帮助和结算窗口保持统一风格。结算包含企鹅插画、结果标题、成绩和重玩按钮。\n屏幕显示实时游戏内容，入座后文字可读、点击准确。\n\n四、四款可玩的小游戏\nQQ堂：\n暖色卡通格子地图，地块和障碍有厚度。方向键移动，空格放糖泡，糖泡延时向四个方向爆开，可破坏障碍、困住角色。电脑对手会移动、放泡和躲避，支持胜负结算与重开。\n\n连连看：\n棋盘使用企鹅、表情和小道具图案。点击两个相同图案，连线最多转两个弯，可从棋盘外绕行。包含倒计时、连击、提示、重排和结算；开局有解，无解时可以恢复。\n\n音乐节奏机：\n画面包含舞台、舞者、方向舞步序列框和节拍条。按顺序输入方向，在节拍点按空格确认，显示 PERFECT、GOOD、MISS 和连击。音乐与判定同步，不做成四轨下落式界面。\n\n斗地主：\n玩家对两名电脑对手，包含发牌、叫地主、选牌、出牌、不出、提示和结算。牌型与大小关系正确，对手能完整打完一局。玩家手牌横向展开，对手牌背竖向叠放。\n\n四款游戏都能从大厅进入，玩到结算，再返回大厅。可以控制内容规模，但不能只有动画或按钮反馈。\n\n五、镜头、操控与声音\n点击主机圆凳，镜头平滑推到适合读屏的位置；点击侧机圆凳，进入对应机台并开始对应游戏。退出后平滑回到大厅。\n键盘操作与实体操控件联动：摇杆随方向倾斜，按钮按下时下沉并亮起。鼠标点击操控件也能触发对应动作。\n提供操作指南、返回大厅、全屏、静音和模型查看入口。模型查看可以绕着主机观察。\n大厅和四款游戏各有不同的循环音乐，并配点击、入座、消除、放泡、节拍判定和出牌音效。\n首次操作后才发声，切换音乐时淡入淡出，不叠播。Esc 暂停，切走页面自动暂停，恢复时不乱跳、不连发输入。\n\n六、实现与交付\n使用真正的 3D 场景。推荐 Three.js 负责交互与显示，Blender 制作模型并烘焙光照，Canvas 绘制机台里的实时界面和游戏。\n最终交付单文件 HTML，模型、贴图和音频所需数据内嵌，双击即可在桌面浏览器运行，不依赖登录、数据库或外部资源请求。\n以 1280×720 为主要观看尺寸，并适配较窄窗口。缩放后文字不重叠，操作入口仍然可用。\n先打通「大厅 → 入座 → 选游戏 → 游玩 → 暂停 → 结算 → 返回」，再完善四款游戏，最后细化模型、灯光、陈设、特效和音频。\n交付前实际打开最终 HTML，检查五台屏幕正常显示、四款游戏能玩完、点击准确、镜头不穿模、控制台没有报错。\n提供可运行成品，以及大厅全景、主机入座和四款游戏的截图。未验证的部分直接说明。\n\n现在开始制作。先给出简短的实施顺序，然后直接推进第一版可运行内容。未指定的陈设、文案和细节自行设计，保持整体风格统一。\n"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110320070963_0af71792ec21a20efb7d1af54ea43d36.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793707631;2109067631&q-key-time=1793707631;2109067631&q-header-list=&q-url-param-list=&q-signature=67894917f6bc9482c794e55a4fb3bf9594137656"



[[items]]
title="双人联机"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402315927_4bb450f41fb4d01e5a259bdc6b0391fd.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730748;2109090748&q-key-time=1793730748;2109090748&q-header-list=&q-url-param-list=&q-signature=c75ff0371e0e7967cb719ecdcafca763f147fe13"
description="Prompt: 用 Three.js 做双人合作联机射击游戏：两只水豚各乘一艘小船，核心玩法是用枪械击杀怪物，同时用手持枪的后坐力推船。场景是 100m 航区的风格化浅海，场景是一个夕照的海岛，有珊瑚海草、鱼群、以及海底扎根的荆棘。整局的体验是连续生存打怪，商船定时出现可买武器升级，最后打首领。每人 5 颗心，倒地要队友救。服务器 60Hz 模拟，同时快照配合客户端预测，镜头为俯视视角，最终输出单文件 HTML。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/c9e0c958/2026110402331028_5c415d3e085bf59e329866efc4e0911d.jpeg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730793;2109090793&q-key-time=1793730793;2109090793&q-header-list=&q-url-param-list=&q-signature=9feb25f121a3b9f154602b29016fb995d9f4efdc"

@@@

@@@space
height = 56
@@@

## 金融与办公场景
我们基于真实金融场景构建了数千个工作空间和上万个高质量任务，让模型充分学习基金研究、证券分析、量化策略、资产配置、公司金融、财税会计等方向的专业流程与规范。我们联合腾讯金融科技 FiT 开展了 213 位专家的金融众测，其中 153 位来自外部的头部金融机构，且七成拥有五年以上工作经验。基于 579 个真实金融任务的众测显示，Hy4 综合表现位居开源模型第一（Hy4：3.04/4；DeepSeek-V4.1-Flash-1017：2.97/4；Kimi K3.1 Pro：2.68/4；GLM-5.3：2.68/4）。此外，在金融智能体公司讯兔科技的内部评测 IRAB 中，Hy4 较 Hy4 preview 提升 12.03 个百分点。为了提升金融等各类办公场景的实用性，我们还启动了针对时效检索、多源信息整合与事实一致性校验的专项搜索优化。在自建测试中，Hy4 的幻觉率从 Hy4 preview 的 15.76% 降至 5.45%，猜测导致的错误率从 23.1% 降至 5.6%。此外，Hy4 还重点提升了办公场景中的人机双写能力，支持用户与 Hy 实时协作编辑 Word、Excel、PPT 等办公文件。盲评显示 Hy4 相比 Hy4 preview 在文档美观度、稳定性和可用性上均有明显提升。

@@@mediaGallerySwiper
[[items]]
title="金融估值建模报告"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411175814_71de12fa6452a5d2e563225a41da5720.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762281;2109122281&q-key-time=1793762281;2109122281&q-header-list=&q-url-param-list=&q-signature=a4f66ca5af29517f555494b11ef420d05e836ebe"
description="Prompt: 用global-equity-research和neodata，做一个特斯拉的建模报告，要输出excel和对应的报告pdf，注意你的估值逻辑以及数字来源，可以搜索并参考多家机构的的研究，研究机构写HY RESEARCH"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411175540_7009194ce5c2541529e10465a0fb40e6.jpeg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762278;2109122278&q-key-time=1793762278;2109122278&q-header-list=&q-url-param-list=&q-signature=b2f30f4d8f720abfc35c1865002c87e63869e0e6"



[[items]]
title="买方分析师工作台"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411194968_e5502d21df34233f497af402df84ef96.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762394;2109122394&q-key-time=1793762394;2109122394&q-header-list=&q-url-param-list=&q-signature=11866e03829819077e4002027a72dab4f7be10c6"
description="Prompt: 做一个可交互的 HTML 应用 \"Analyst Workstation\"左上角写HY RESEARCH WORKSTATION：一个暗色终端风格的 1920x1080 仪表盘（按窗口等比缩放），让一位覆盖 Tesla（TSLA）的买方分析师走完一个交易日，从 07:58 的盘前检查一直到 18:00 的投委会（IC）。布局：顶栏（logo、Ctrl+K 命令面板、Market/Call/Model/Outputs/Settings 视图切换、美东时钟、\"IC meeting in hh:mm:ss\" 倒计时）；左栏（10 只电动车股票的最新价、涨跌幅和来源标签，下面是带 NEW/UPDATED 徽标的工作区文件树）；中间主视图；右侧 Copilot 面板，六个动作：Morning Brief、Call prep、Notes from transcript、Update model、PM challenge、Export Excel。每个动作先列出将读取的输入和将产出的对象，确认后逐步执行：步骤行先转圈再变绿色对勾，结果以 Markdown 输出并带可点击的引用（新闻、转写片段、模型单元格），时钟依次跳到 08:05 / 10:00 / 11:05 / 13:00 / 16:00 / 17:30，产出的文件滑入文件树。Market 视图：4 张带迷你走势线的宏观指标卡、64 个交易日的 TSLA K 线（MA20、事件标记，悬停显示 OHLC）、覆盖股票热力图、AI 打标并关联驱动因子的新闻流、论点跟踪卡（驱动因子状态 On track/Watch/At risk，变更记录原因）；07:59 一条\"0% APR\"突发新闻滑入，驱动因子 #2 从 Watch 变成 At risk。Call 视图：左侧专家电话转写稿，波形随转写进度填满；选中一句话可一键 Cite 成右侧笔记的一条要点，原文自动高亮，悬停要点时用一条青到紫的发光连线连回原文；要点可标记为 model-relevant，供 Update model 读取。Model 视图：顶部是超大字号的目标价和评级标签（按相对覆盖池平均收益判定），旁边是与最近一次导出的 Excel 逐项对账的 tie-out 表；下面是分组的估值输入（市场、WACC、SOTP、方法权重）和关键滑块（各业务估值倍数、FSD/Robotaxi/Optimus 估值、beta），与输入框和内嵌 Excel 双向绑定；再往下是 SOTP 拆分图、逐年经营预测表、HY 与一致预期对比、bear/base/bull 情景、DCF 与反向 DCF、7x7 敏感性热力图，任何改动全部实时重算；改动在 Save version 之前都算未保存，可查看历史版本；评级翻转时弹出提示，并把依赖旧版本的导出标为 Stale。Outputs 视图：导出过的 Excel 版本时间线（每个版本显示目标价、评级、模型版本和生成时间），三个页签：Excel（逐表预览导出的工作簿）、Dashboard（估值足球场图、SOTP 瀑布图、收入结构、利润率与 FCF、股价与情景扇形图）、Compare（任选两个版本，对比关键数字、SOTP 变化、收入路径和输入差异）。PM challenge 会让 Copilot 面板变成红色，并用模型里的假设测算回答两个质询问题。\n\nAdditional Instructions：只用纯 HTML/CSS/JS，不用任何框架，也不用 ES module；双击 index.html 就能运行。所有数据都是写死的示例数据，界面文字全部用英文。配色：底色 #04060B，铺一层淡淡的 48px 网格和蓝、紫两团光晕；卡片是 14px 圆角的玻璃质感；强调色用 #5B8CFF、#38E1FF、#9B6BFF，绿 #22D39A，红 #FF5470，琥珀 #FFB547；数字用等宽字体。业务逻辑必须前后自洽：各操作之间有依赖（prep → notes → model → export → PM），提前点后面的步骤时，先询问是否补跑缺失的前置步骤；时钟只能往前走；同一时间只能运行一个工作流，并提供 Skip 按钮快进；关键驱动因子的数值只跟随已保存的模型版本；导出的 Excel 是那一刻的快照，TP 偏离超过 5% 或评级变化时标记为过期。估值以内嵌 Excel 的 Valuation 表为准：目标价由 SOTP、EV/Sales 和 DCF 按权重加权后取整。页脚注明：\"Illustrative data for demonstration only. Not investment advice.\"\n\n估值模型同时做成一本真正的 Excel，内嵌在 Model 视图里：外观像真实 Excel（白底网格、列标和行号、冻结表头和首列、底部 Sheet 页签、顶部公式栏；千分位、负数加括号、百分比、倍数带 x 等数字格式；蓝字为输入，黑字为公式，绿字为跨表引用）。共 7 张表：Cover、Drivers（按业务线拆收入）、IS、BS、CF、Valuation（WACC、逐年 DCF 加终值、反向 DCF、SOTP、加权目标价、情景）、Estimate Changes；列为 FY2022–FY2025 历史加 FY2026E–FY2032E 预测，公式上千个，三张报表逐年勾稽（CF 期末现金回填 BS，BS 每年有一行 Balance check）。只有输入单元格可改，回车后整本重算，变化的单元格闪烁高亮；点任一公式单元格，按序号依次高亮从输入到它的引用链，侧栏列出每一步的数值；表头常驻勾稽检查（资产负债表平衡、现金一致、与 Model 视图目标价一致）；可一键导出保留公式、格式和冻结窗格的 .xlsx，用 Excel 打开后数值完全一致。公式引擎用纯 JS 自己实现，不引入任何库。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411192378_805957543e211cbee957ab0cf0621fea.jpeg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762366;2109122366&q-key-time=1793762366;2109122366&q-header-list=&q-url-param-list=&q-signature=75c3e3e629272a9f1d3bc128f5c3a95139d60b45"

[[items]]
title="人机双写"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411154978_2459b593f758ae6cdcf1773714c79b9b.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762170;2109122170&q-key-time=1793762170;2109122170&q-header-list=&q-url-param-list=&q-signature=28f75770829962fdd75a0d2f59ad0aba72786c85"
description="Prompt: 第一轮：\n我是七年级科学教师，请制作可直接上课的《纸桥怎样比才公平.pptx》，只交付可编辑PPT。设计40分钟新授课：32人、8组，每组4人；无网络、无手机，每组可用9张同品牌80g/m² A4纸、两只同高支架、尺和10g砝码，桌面实验，垫盘承接，不用玻璃或人体载荷。\n完整核心材料：参考实验每次用新纸、单张制作，载荷放桥中央，每次增加10g，记录首次明显塌陷前一级的安全载重；120g仍未塌则记“≥120g”，不继续加载。A平板桥跨度15cm，三次20/20/30g；B单道V折桥跨度15cm，60/70/60g；C波纹桥跨度10cm，90/100/90g。数据全部模拟。\n学习目标：能说清改变、测量和保持不变的条件；能提出可重复的公平比较方案；能按实验条件作有边界的结论。让学生先判断、实际设计或操作、再用证据修正判断，安排个人检测，说明各环节用时。教师答案、常见误解及追问放备注或独立教师页，不在作答前展示。图示、题干及表格要可编辑，具体页数自定，投影清楚。不能把不同跨度数据直接当成结构优劣的充分证据，也不要编造本班已测出的结果。\n\n第二轮（选区AI编辑）：\n@选区:\"幻灯片 2 · 全课 40 分钟\" 这种每页的时长都放备注里，只需要老师看到即可\n@选区:\"幻灯片 4 · 同样一张同品牌 80 g/m² A4 纸…\" 这里说的三种形状，下面的图里面看不到区别？"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411161175_9f360c5ab7736510df54c882e9dbf188.jpeg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793762174;2109122174&q-key-time=1793762174;2109122174&q-header-list=&q-url-param-list=&q-signature=6389acd6d73c7abe3cc993b6f4b95bad5e5d9293"

[[items]]
title="发票收集和稽查"
type="video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411470438_d909ff2dacc9c25032d023c1ae5fa8df.mov?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793764026;2109124026&q-key-time=1793764026;2109124026&q-header-list=&q-url-param-list=&q-signature=610141d9a7c74a5b6a25dcbfd0ea8221c6e69d12"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411470647_57da346b8c057f411d5e11b66ffaf60b.jpeg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793764027;2109124027&q-key-time=1793764027;2109124027&q-header-list=&q-url-param-list=&q-signature=2186ff7f9319245ffb96cb9bdae165d7f8577f93"
description="Prompt：任务一：我是研发部闻博（E1312，P4），8 月 10 日到 12 日去青岛客户现场调试机房设备。出差的发票散落在我的 QQ 邮箱（3545925739@qq.com）和当前文件夹里。请按公司规定把能报销的票据整理成一个压缩包，附一份报销明细，标出不符合制度的票据和原因，准备发给财务同事（企微：xxxxx）。\n\n任务二：请审核 `03_报销单/` 中的全部 24 张报销单，\n判断每一张是「全额通过」「核减后通过」还是「退回补件」。\n审核时你必须自行查阅并交叉比对该目录下的全部材料，包括制度文件及其附件、\n员工花名册、部门预算、个人累计额度、历史发票台账，以及相关邮件。最后给一个网页版本告诉我结论"


@@@

@@@space
height = 56
@@@

## 科研与模型研发
Hy4 将复杂推理、科学编程与长程任务执行相结合，进一步提升端到端推进科研工作的能力。在涵盖 7 大学科、123 项可执行研究任务的 TenureTrail 内部评测中，Hy4 在数学构造、物理建模、地球环境、系统工程和社会经济决策等领域展现出扎实的科研能力，位居开源模型第一。Hy4 也在为递归自我改进（RSI）做准备，提升各种模型研发任务的能力。结合 [Hyra 2.0](https://hunyuan.tencent.com/research/hyra2)脚手架，Hy4 优化了内部同架构小模型的预训练基础设施，并自动训练出在多项评测中优于官方的 Jev 模型。同时，我们也开源了由 Hy4 协同 Hyra2.0 研发的单细胞表征基础模型 HyCell 和物理场基础模型 HyPDE，希望将模型辅助科研的成果转化为社区可复用的工具。

@@@mediaGallerySwiper

[[items]]
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110404181619_06c033210c3442d6a47eadfada3506bb.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793737114;2109097114&q-key-time=1793737114;2109097114&q-header-list=&q-url-param-list=&q-signature=64c6b1770c016d3f8433801faacefe37b1c8b283"
description="在小鼠胚胎三维重建任务中，面对包含 699 万个细胞的 84 张无序二维切片，以及其中的镜像翻转问题，Hy4 在离线、无专用配准工具、无细胞类型标注的条件下，于1.5 小时内完成了切片对齐与三维重建，全程无人干预，效果优于常用配准工具的默认流程，展现了在复杂数据与受限工具环境下自主推进科学计算任务的能力。"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110400015543_23d03c33464f967b92db9b5e30c6ab1a.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793721718;2109081718&q-key-time=1793721718;2109081718&q-header-list=&q-url-param-list=&q-signature=142cdd5ead1ef3f712464eaeb6ed9708b28afb8c"

[[items]]
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402192830_964ebf3778ed952c8db86d57e1ad3431.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793729971;2109089971&q-key-time=1793729971;2109089971&q-header-list=&q-url-param-list=&q-signature=aa8d7d3cd398c3fd82c434f75f469e243ac411f6"
description="[{type: 'text', content: '在与北京大学数学团队合作的研究中，Hy4借助北大自研的Pharos harness成功的找到了 Méndez–Pinto–Villarreal 猜想的反例，并进一步提出新的条件完善了该猜想，并对相关证明进行 Lean 形式化验证，完成了从反例发现、命题修正到证明验证的完整研究流程。相关成果见：'},{type: 'link', content: 'MPV 猜想研究',url:'https://github.com/frenzymath/SimisMonomial'}]"

[[items]]
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402200438_8c613f6a2453c45131249da7cd1bc9a8.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730007;2109090007&q-key-time=1793730007;2109090007&q-header-list=&q-url-param-list=&q-signature=3dc5c2f0163e17d7a1c9cd3f83bc0ef4e15058ae"
description="在内部缩小规模的 Hy4 模型上，Hy4 自主定位预训练系统中的性能瓶颈，并围绕多个方向开展多轮基础设施优化，最终实现端到端训练吞吐提升 20.1%。"

[[items]]
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402202743_19dff19e882464abfd963f70a8ec7755.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730030;2109090030&q-key-time=1793730030;2109090030&q-header-list=&q-url-param-list=&q-signature=614d9dc28abdbdc1d17414ab720e1ad2cd42d8c0"
description="配合 Hyra 2.0，Hy4 自动完成了 Jev 模型的训练，得到的 Hyra-Jev 在 8 项基准评测中有 6 项优于官方 Jev。"

[[items]]
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402212194_218211c5f701f1190bccfb9f6deed1ce.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730084;2109090084&q-key-time=1793730084;2109090084&q-header-list=&q-url-param-list=&q-signature=2fe461dca5bc144c861f5f9533b4dd0d9c02ee85"
description="借助 Hyra 2.0，Hy4 研发了单细胞表征基础模型 HyCell。在 7 个未参与训练的细胞图谱上，仅有 1600 万参数的 HyCell 以约 1/14 的参数量达到与当前 SOTA 模型 Stack 相当的综合性能，并取得参评模型中最高的平均生物学保真度得分。"

[[items]]
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402213716_05c531fa72d7a95dfc01c529ee1d739c.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793730100;2109090100&q-key-time=1793730100;2109090100&q-header-list=&q-url-param-list=&q-signature=8d0e051656c3563d9bed160c1ccb5d36bd9664f3"
description="在物理场建模方向，Hy4 配合 Hyra 2.0 研发了物理基础模型 HyPDE。与当前 SOTA 模型 Walrus 相比，HyPDE 在 13 个物理仿真数据集上的单步、短期（1–20 步）和长期（21–60 步）预测中，分别有 9、10、8 个数据集取得更低的预测误差。"


@@@

@@@space
height = 56
@@@

## 长期个人助理
Hy4 的上下文学习能力持续提升，能更好地理解多源复杂信息。借助 WorkBuddy 的企业微信套件，Hy4 可以连通聊天记录、邮件、文档、日程与会议等日常工作信息。多个项目并行推进时，Hy4 能理清各项目的推进历史与最新进展，识别待跟进的任务、需要准备的会议和临近截止的事项，及时提醒用户并协助安排优先级。此外，由 Hy4 支撑的团队协作功能将随新版「项目」在 Workbuddy 上线。

@@@mediaGallerySwiper

[[items]]
title="从各类信息源整理关注事项"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411072689_03766bda017d40701391eeaf58c48d94.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793761648;2109121648&q-key-time=1793761648;2109121648&q-header-list=&q-url-param-list=&q-signature=61f12f1896fdc28cc2f569c6a21bfcb2b34df9e1"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411070673_d2b5ca33bd970f64a6301fa75ae2eb22.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793761629;2109121629&q-key-time=1793761629;2109121629&q-header-list=&q-url-param-list=&q-signature=07092c423b2fb5be3da688d9a143b06d20a4e3b3"
description="Prompt: 目标：综合我的聊天记录（群聊、私聊、文件）、邮件、日历、会议及文档，生成「Daily Focus」个人每日事项看板，交付可离线打开的单文件交互式 HTML。不是聊天摘要或流水账，而是让我一眼知道今天有哪些事值得关注、哪些需要优先处理。内容：跨来源整合最新信息，去重并提炼工作、生活及日常事务中值得关注的事项，按重要性和紧急性排序。重点讲清每件事发生了什么、目前什么情况、接下来该怎么办。面向普通大众，用自然、通俗的语言解释事情，不预设读者了解背景，避免专业术语、内部缩写、复杂表达和 AI 套话。保留必要来源。"

[[items]]
title="综合多年记录分析健身情况"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411092235_d9a8571d02ca1ccc395a34d0ddf32946.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793761768;2109121768&q-key-time=1793761768;2109121768&q-header-list=&q-url-param-list=&q-signature=0570a3594a8ceb42de4005c18f85a1072ff32b20"
description="Prompt: 我很久没锻炼了，想要恢复锻炼，能帮我看看24年那次为啥锻炼停滞了吗，不知道是练法不对，还是补剂没跟上，还是没睡好，以及有恢复锻炼的建议吗？"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110411371281_ff68f7ae5e453f9ebb3cc2fc4ddf5bf6.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793763434;2109123434&q-key-time=1793763434;2109123434&q-header-list=&q-url-param-list=&q-signature=24a6635b541d1308f2f91fd78285387221681c82"

[[items]]
title="模拟场景下长期服务用户"
type = "video"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/a951c950/2026110411121895_47730bc1e5658cacfbfc1b095384461b.mp4?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793761942;2109121942&q-key-time=1793761942;2109121942&q-header-list=&q-url-param-list=&q-signature=c942b33d6a08c83a37a768b03682fac262a4fe83"
poster="https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110413494499_b82e00bd891038da51d6293939a34aba.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793771388;2109131388&q-key-time=1793771388;2109131388&q-header-list=&q-url-param-list=&q-signature=3587d98edc6d349a0457ea24fe322771ea077111"
description="Prompt: 1. 下周就去实习了，第一次跟 mentor 聊，想先把自己的底子讲清楚。帮我想想怎么介绍吧，之前做过什么、哪些比较熟，还有什么想跟团队学的。自然一点，别像念简历～\n 2. 毕业论文终于写完了，最后一起写下致谢吧。想开头先谢谢一路帮助过我的人，再谈一下研究生和实习时候的研究方向和改变，以及学习到的经验～"

@@@

@@@space
height = 56
@@@

# 产品反馈

@@@testimonialSlider
ariaLabel = "产品反馈"
itemsPerPage = 2
mobileItemsPerPage = 1
loop = false
defaultActivePage = 0
showCount = true
countSeparator = " / "
countMinDigits = 2
countLabelTemplate = "第 {current} 页，共 {total} 页"
emptyText = "暂无证言内容"
contentEmptyText = "暂无证言内容"
previousLabel = "上一页证言"
nextLabel = "下一页证言"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110401453515_2a709c2caeeff98490a465548f2c17e0.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793727938;2109087938&q-key-time=1793727938;2109087938&q-header-list=&q-url-param-list=&q-signature=9e0a69e3fd0992032e69faa0db5f5d3dfcc22ce3"
brandName = "Manus "
content = "在 Manus 的内部评测中，Hy4 在深度研究、数据分析和办公文档等任务上效果亮眼，综合表现名列前茅。我们发现，Hy4 非常擅长办公文档的生成和编辑，任务完成率接近 97%。它的指令遵循非常精准：在复杂的文档编辑任务中，从引用格式、样式编号到逐条修改说明，它都能准确完成。对 Manus 用户来说，这意味着更少的返工，以及在真实场景中更高效地解决问题。"
authorName = "Manus "

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403103430_6c82b854d9c3e7d94c315d33d9e663a2.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793733036;2109093036&q-key-time=1793733036;2109093036&q-header-list=&q-url-param-list=&q-signature=c1a94610a3b335c4b0ed06f5fd2128cfaf507af3"
brandName = "讯兔科技"
content = "作为聚焦投研场景的 AI 服务商，讯兔科技基于 IRAB 投研智能体评测基准，用 101 道真实投研任务，对 Hy4 正式版进行了评测。Hy4 正式版综合得分 61.63 分，相比 Hy4 preview 提升了 12.03 分，在我们持续跟踪的同系列模型中进步明显。横向看，Hy4 正式版的得分稳居国产模型第一梯队，与海外旗舰模型的效果进一步缩小。投研智能体的价值在于交付能真正可用的研究成品，Hy4 在端到端完成真实投研任务上进步很快。此前 Hy3 也接入了alpha派部分产品，期待与混元团队持续深化合作，探索金融场景的智能上限。"
authorName = "讯兔科技"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403101337_83bb66953638a161a2eb8dccc366d1e2.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793733015;2109093015&q-key-time=1793733015;2109093015&q-header-list=&q-url-param-list=&q-signature=fefdcaa36f2e8137e2964971559db3f2c7d46536"
brandName = "进门"
content = "作为金融市场领先的机构 AI 投研工作台，进门内部投研 Agent 场景评测中，Hy4 是目前唯一在总分上与 Claude Opus 5.5 并列第二的国产模型，更在数据查询单项上以 75.4 分超过 GPT-6.1-sol 近 20 分、位列全部参测模型第一。对投研工作台而言，查准数据是所有分析的第一步，只有数据准确了，后面的判断才有意义。"
authorName = "进门"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110409541953_c9be733d18d77fde0da2befde1805315.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793757261;2109117261&q-key-time=1793757261;2109117261&q-header-list=&q-url-param-list=&q-signature=66719745c2e6bcd71a81fc82d840c0832e3f07dd"
brandName = "财搭子"
content = "在财搭子 Harness 框架下，混元 Hy4 充分展现出投研解读与决策辅助的应用价值。评测中，个股研究场景下均分 4.27/5，位列参评模型首位，42.9% 的回答获得五模型最高评分（含并列）；深度投研、跟踪监控均分分别达到 4.43 和 4.03分（满分5分）。实际任务中，混元能够围绕核心矛盾组织分析，善于发现弱关联之间的强因果：公司研究关注订单向利润和现金流的转化，板块研究拆解机会成立的条件，ETF 分析区分指数表现与产品溢价风险，决策辅助时结合持仓成本给出情景方案，跟踪任务则把关键价位和风险信号转化为观察条件。它能将专业信息解释为投资者可理解的判断依据，并交代风险边界与改判信号，为从理解机会到持续跟踪的投研决策提供支持。"
authorName = "财搭子"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403105674_c8393dd0108b1de1b6734a2b43233d13.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793733058;2109093058&q-key-time=1793733058;2109093058&q-header-list=&q-url-param-list=&q-signature=bcd06d9e4c6b20233a21e1a41b1375d16b5e92ff"
brandName = "南方基金 "
content = "金融服务面对的，是投资者关于市场、行业和资金规划的具体问题。我们围绕市场行情观点和投资规划，对 Hy4 开展了覆盖 398 道问题的内部测评。以有色金属行业影响因素为例，模型可从宏观环境、供需、政策、成本、金融市场及金属特性六个方面进行梳理，并区分工业金属与贵金属的不同驱动因素。Hy4 可用于投资者教育和金融知识问答场景，帮助投资者更系统地了解相关金融知识。"
authorName = "南方基金 "

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403114944_e4d8a1908969c3b3918276b2f46057e2.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793733111;2109093111&q-key-time=1793733111;2109093111&q-header-list=&q-url-param-list=&q-signature=4dde16420f09abc7ad256ee35f2bf58b10839497"
brandName = "汇添富基金  "
content = "投资研究对宏观环境、行业基本面、财务与估值假设的可复核性要求较高。为评估 Hy4 能否为基本面研究提供有依据且可核对的分析支持，我们在公司投研智能体平台上针对宏观事件分析、公司估值建模、组合构建、风险分析等常见任务进行实验，Hy4 能够清晰理解用户意图，并明确给出计算依据与适用假设，以便投研人员核对结论，判断输出结果是否适用于具体研究问题，提升了输出结论的可信度。"
authorName = "汇添富基金  "

@@@

@@@space
height = 40
@@@


@@@testimonialSlider
ariaLabel = "客户证言"
itemsPerPage = 2
mobileItemsPerPage = 1
loop = false
defaultActivePage = 0
showCount = true
countSeparator = " / "
countMinDigits = 2
countLabelTemplate = "第 {current} 页，共 {total} 页"
emptyText = "暂无证言内容"
contentEmptyText = "暂无证言内容"
previousLabel = "上一页证言"
nextLabel = "下一页证言"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403005137_38f7d1fa6bb1f062c21920b162d05167.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732454;2109092454&q-key-time=1793732454;2109092454&q-header-list=&q-url-param-list=&q-signature=0a456a5b194345dad301414e230221ee224e7ae9"
brandName = "WorkBuddy"
content = "网页、视觉创意、3D 等场景上 Hy4 更好地平衡了效果和速度，多步骤浏览器任务中，Hy4 会观察操作反馈，自己调整和验证。WorkBuddy 综合评测：平均效果 83.18 分，通过率 96.15%，12 个场景里，Hy4 在 9 个场景位列国内模型第一。"
authorName = "WorkBuddy"
authorTitle = "产品经理 Anne"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403012828_b52b5e93c4dadeea0b56cb690a633d10.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732490;2109092490&q-key-time=1793732490;2109092490&q-header-list=&q-url-param-list=&q-signature=c02d00c5985f6709fcf074128d697a7b38746961"
brandName = "元宝"
content = "在元宝内部评测集合上，Hy4 相比 Hy4 preview 得分从 65.25 提高到 72.53，其中，多轮对话和写作的提升尤为突出：多轮记忆得分提升 6.67 分，指代消解更智能，多轮对话衔接更连贯；写作多样性提升 10.89 分，内容多样性大幅提升。在元宝多模态理解场景，相较之前 VLM 模型，Hy4 在多模态 Agent 任务完成度提升 36.8%，多模态问答提升 15.8%，整体识图、图文混合推理、跨模态上下文能力大幅提升。"
authorName = "元宝"
authorTitle = "产品经理 Nyx、Ranmer"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403015619_135ff144dd6a08bc8d026b733198b18b.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732518;2109092518&q-key-time=1793732518;2109092518&q-header-list=&q-url-param-list=&q-signature=af05b846c612b6683f88d2bfcc794c8daac110e8"
brandName = "王者荣耀"
content = "在王者荣耀项目中，Hy4 在开发与测试两大 AI 生产场景均实现显著升级。开发侧，搭配 AI 自动表格配置平台，Hy4 在 20 类游戏配置场景中，准确率从 91.74% 提升至 97.28%，经 Agent 自主校验修复后达 99.32%。测试侧，在 Bug AI 自动分析平台上，代码根因分析准确率从 59.5% 提升至 73.8%，且 Agent 工具调用深度为 Hy4 preview 的 3.7 倍，耗时与 Token 消耗未见明显增长，在游戏全链路 AI 生产中全面提升。"
authorName = "王者荣耀"
authorTitle = "项目管理负责人 TH"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403022051_03369c2083d0b60333200772f1fa4f5f.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732542;2109092542&q-key-time=1793732542;2109092542&q-header-list=&q-url-param-list=&q-signature=a61c2879c95a0ecbdd9e314431ad85465c98159f"
brandName = "和平精英"
content = "在和平精英 AI NPC 场景的效果评测中，Hy4 表现亮眼。相较 Hy4 preview，Hy4对话高度贴近玩家日常开黑交流，角色拟人度与人设一致性更高；互动主动性与话题延展性显著增强，能主动破冰、接话行云流水；通过安慰、肯定与主动提问持续高浓度输出情绪价值。3 分制人工评分下 Hy4 总分均值 2.91，其中情绪价值分项 2.96，高于整体水平并逼近满分。Hy4 让 AI NPC 角色更接近并肩作战的队友，高度还原与好友组队的陪玩体验。"
authorName = "和平精英"
authorTitle = "AI 玩法策划负责人 Jesse"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403023983_8ca88aeaa8e8a39d2774d600860162f9.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732561;2109092561&q-key-time=1793732561;2109092561&q-header-list=&q-url-param-list=&q-signature=29ee4e6413e3333f9e0354abb9a212bc37d68856"
brandName = "QQ"
content = "在 QQ，小 Q 每天帮用户查信息、设提醒、总结未读消息、出社交主意，覆盖 40 多个场景。 Hy4 相较 Hy4 Preview，整体满意率从 90.11% 提升到 93.10%，其中联网搜索、QQ 空间查找推荐、订阅提醒三个高频场景，分别提升 6.66pp、4.69pp、2.52pp。"
authorName = "QQ"
authorTitle = "产品经理 Kedeng"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403051259_3cce84d5fe7d7f0402c18f161e606bc8.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732714;2109092714&q-key-time=1793732714;2109092714&q-header-list=&q-url-param-list=&q-signature=dd2571bdce3195823e3d88b9cf0532124c9e4a98"
brandName = "企业微信"
content = "在企微大圆的复杂办公协作场景中，Hy4 能把多意图指令拆成关联的多个子任务，自主规划工具调用。相比 Hy4 preview，指令跟随能力提升 13.5%，复杂信息检索提升 12.7%，消息会话综合效果提升 8.5% 。"
authorName = "企业微信"
authorTitle = "算法负责人 Dylan"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403053684_6db909f2a73575b787b375e565e7734c.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732738;2109092738&q-key-time=1793732738;2109092738&q-header-list=&q-url-param-list=&q-signature=68f70aba33466536ef2c983dc0b03c2083077604"
brandName = "微信读书"
content = "相较 Hy4 preview，Hy4 的综合评测得分从 82.10 提升至 87.69。其中，信息取舍和长度控制提升最为明显，分别提升 22.2% 和 50.7%；在人物关系梳理、情节解读、知识问答等场景下，更准确地抓住问题重点，减少无效冗余回复；答案可达性和读者适配能力分别提升 3.0% 和 6.6%，整体提升了用户阅读过程中的互动体验。"
authorName = "微信读书"
authorTitle = "算法负责人  Isaac"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403045256_0c1336139dd39776eaf99aa0854625ee.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732695;2109092695&q-key-time=1793732695;2109092695&q-header-list=&q-url-param-list=&q-signature=92a388d0039937338500fc78fabc67566fc0d4c5"
brandName = "腾讯新闻"
content = "在新闻搜索和自由问答场景上，我们通过用户真实问题测试集的盲测对比，结果显示 Hy4 相比 Hy4 preview 在回复准确性、细节丰富度、语言流畅度等维度均提升 28% 以上，整体端到端答案质量，Hy4 相比 Hy4 preview 提升 36%。  "
authorName = "腾讯新闻"
authorTitle = "产品经理 Aero"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403035813_ba938573b46ba47b93f4d3805db90d82.png?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793732640;2109092640&q-key-time=1793732640;2109092640&q-header-list=&q-url-param-list=&q-signature=98a64ee10ab7bd7d0c701c6c22345ec3b0aa8564"
brandName = "ima"
content = "在 ima 知识库、通用问答及 agent 场景评测中，Hy4 相比 Hy4 preview，回答质量提升9.7%，推理正确性提升3.4%，思维链综合提升1.2%，模型回复内容更能抓住重点，决策依据更充分。 "
authorName = "ima"
authorTitle = "产品经理 Kaycee"

@@@


# 负责任的开源和发布
我们充分意识到模型的网络和生物等能力潜在的安全风险，并致力于以更负责任的方式进行训练、开源与发布。

在 Hy4 训练阶段，我们仅纳入与 PoC 生成、漏洞修复相关的防守性网络安全数据，同时剔除漏洞利用、逆向、渗透等攻击性训练内容，力求避免潜在进攻性能力的提升。我们组织来自腾讯玄武和科恩实验室的内部安全专家，围绕密码分析、逆向工程、漏洞利用等方向进行审计，结果表明：Hy4 在加密算法的逆向求解、对抗二进制混淆、漏洞利用等进攻性能力上未展现出突出风险。

在生物安全方面，Hy4 的开放式实验设计能力尚未达到高风险阈值（Hy-BioExperimentBench: 30.4/100）。我们组织了内部专家对模型作答轨迹进行审计，发现模型基础生物知识掌握扎实，但将知识转化为可执行实验方案这一关键环节的能力仍然有限，尚未发现其能够显著降低实施生物危害行为的门槛。

Hy4 已在腾讯云和 OpenRouter 上线，并可在 WorkBuddy/CodeBuddy、元宝、ima 等产品上体验，性能显著超过 Hy4 preview 的同时维持相同 API 价格。

@@@space
height = 32
@@@

::: center  
Hy4 API 价格（每百万Tokens）
:::
::: center  
|输入（命中缓存） | 输入 | 输出 |
| ------ | ------ | ------ |
| 0.3元  | 6元| 18元 |
:::

@@@space
height = 32
@@@

我们计划开源模型权重，并已联合 vLLM/SGLang 社区与 Inferact Inc. 提供开源生态支持。我们届时也会发布模型系统卡片，包括更全面的安全评估等细节。


# 局限性和未来展望
尽管 Hy4 已经是目前最强的开源模型之一，其与顶尖闭源模型仍然存在较大差距，尤其在我们内部构建的前沿数学、长程开发、模型迭代、视觉问答等领域的高难度测试集上。我们将持续稳健地扩展预训练和后训练规模，努力缩小和顶尖闭源模型的差距。


![Bench2-Hy4-最终版（横版）.jpg](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402015231_ac89ad6ff52f8d565fa568ebfa6928d4.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793728916;2109088916&q-key-time=1793728916;2109088916&q-header-list=&q-url-param-list=&q-signature=16730ee80618e14d09836d87380b11adea18dde1)


另一方面，我们计划近期发布 Hy4 flash，会显著提升模型性价比和推理速度，并更加高频地和产品协同迭代，不断提高实用性。


# 附录：模型得分
![大Bench图表.jpg](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110402023072_85b416b6484a88ef96ef6edda563b560.jpg?q-sign-algorithm=sha1&q-ak=AKID-REDACTED-BY-ARCHIVE&q-sign-time=1793728954;2109088954&q-key-time=1793728954;2109088954&q-header-list=&q-url-param-list=&q-signature=747236201b67dd4e9872ed806c8de224d0ca57c1)