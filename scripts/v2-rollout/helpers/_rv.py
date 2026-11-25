# 从 gate 用的 reverify.py 中原样抽取 norm/fetch/jina/hit（保证与验收逐字一致，不复制实现）
import ast, os, re, sys, json, subprocess, hashlib, html, unicodedata

# --- 路径解析 ---------------------------------------------------------------
# 原机是扁平根 /workspace/rollout（reverify.py 与 evidence/ view/ fresh/ 同级）。
# 入库后三个数据根默认落在仓库内，可用环境变量覆盖；reverify.py 本身随版本留在
# scripts/v2-rollout/ 下，不再要求与数据根同级。
_HERE = os.path.dirname(os.path.abspath(__file__))              # <repo>/scripts/v2-rollout/helpers
_V2ROOT = os.path.dirname(_HERE)                                 # <repo>/scripts/v2-rollout
_REPO = os.environ.get('EVALS_REPO') or os.path.dirname(os.path.dirname(_V2ROOT))
R = os.environ.get('ROLLOUT_ROOT') or os.path.join(_REPO, 'data')  # 扁平根（兼容旧调用点）
EVIDENCE_DIR = os.environ.get('EVIDENCE_DIR') or os.path.join(R, 'evidence')
VIEW_DIR = os.environ.get('VIEW_DIR') or os.path.join(R, 'view')
FRESH_DIR = os.environ.get('FRESH_DIR') or os.path.join(R, 'fresh')
REVERIFY_PY = os.environ.get('REVERIFY_PY') or os.path.join(_V2ROOT, 'reverify.py')

# reverify.py:11 的模块级 os.makedirs(FRESH_DIR) 不会被执行——ast 只抽取
# norm/fetch/jina/hit 四个函数体。fetch() 在缓存未命中时直接 open(FRESH_DIR/...)，
# 因此干净克隆（fresh/ 尚未建）上首次抓取会 FileNotFoundError。这里补上同一动作。
# VIEW_DIR 不需补：srcfetch.py 自己会 makedirs($VIEW_DIR/<bid>)（含父目录）。
os.makedirs(FRESH_DIR, exist_ok=True)

# --- 抽取实现 ---------------------------------------------------------------
_src = open(REVERIFY_PY).read()
_tree = ast.parse(_src)
# fetch/jina 里的 R 是「装着 fresh/ 的那个目录」（原机即扁平根），注入 FRESH_DIR 的父目录。
_FRESH_PARENT = os.path.dirname(FRESH_DIR)
_ns = {'json': json, 'sys': sys, 're': re, 'os': os, 'subprocess': subprocess,
       'hashlib': hashlib, 'html': html, 'unicodedata': unicodedata, 'R': _FRESH_PARENT}
_mod = ast.Module(body=[n for n in _tree.body if isinstance(n, ast.FunctionDef) and n.name in ('norm', 'fetch', 'jina', 'hit')], type_ignores=[])
exec(compile(_mod, 'reverify.py', 'exec'), _ns)
norm, fetch, jina, hit = _ns['norm'], _ns['fetch'], _ns['jina'], _ns['hit']
def cache_path(url, j=False):
    return f"{_FRESH_PARENT}/fresh/{hashlib.md5((('jina' if j else '') + url).encode()).hexdigest()}.txt"
def is_pdfish(url):
    return bool(re.match(r'https://arxiv.org/(?:abs|pdf|html)/([\w.]+?)(?:v\d+)?(?:\.pdf)?/?$', url)) or url.lower().endswith('.pdf')
