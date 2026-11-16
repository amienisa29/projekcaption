"""Jana build/artifact.html (versi claude.ai) daripada index.html.

claude.ai bungkus page dengan <head> sendiri, jadi kita ambil <title>,
stylesheet dan isi <body> sahaja, dan buang benda khusus PWA.
"""
import pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
title = re.search(r"<title>.*?</title>", html, re.S).group(0)
fonts = re.search(r'<link href="https://fonts.googleapis.com[^>]*>', html).group(0)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
body = re.sub(r"<script>\s*if \(\"serviceWorker\".*?</script>", "", body, flags=re.S)
body = body.replace('<button id="install" class="btn gold install hidden" type="button">📲 Pasang App</button>', "")

out = f"""{title}
<meta name="claude:viewport-fit-sides" content="cover">
{fonts}
<link rel="stylesheet" href="style.css">
{body.strip()}
"""
(root / "build").mkdir(exist_ok=True)
(root / "build" / "artifact.html").write_text(out, encoding="utf-8")
print("build/artifact.html siap")
