from pathlib import Path
import re

path = Path('src/App.css')
css = path.read_text(encoding='utf-8')

def replace(pattern, repl):
    global css
    css, n = re.subn(pattern, repl, css, flags=re.S)
    if n == 0:
        raise SystemExit(f'Pattern not replaced: {pattern}')

replace(r'"\.topbar--hero\.is-solid ".topbar__search \{[\s\S]*?\}"\"', """.topbar--hero.is-solid .topbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 44px;
  width: 60px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 18px;
  color: #0f172a;
  overflow: hidden;
  margin-inline-start: auto;
  box-shadow: 0 22px 38px -28px rgba(15, 23, 42, 0.25);
  transition: width 0.32s ease, background 0.32s ease, border 0.32s ease, box-shadow 0.32s ease, gap 0.24s ease;
}
""")

replace(r'"\.topbar--hero\.is-solid ".topbar__search.is-open \{[\s\S]*?\}"\"', """.topbar--hero.is-solid .topbar__search.is-open {
  width: 320px;
  padding-inline: 18px;
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(148, 163, 184, 0.42);
  box-shadow: 0 28px 46px -28px rgba(15, 23, 42, 0.3);
  gap: 12px;
}
""")

replace(r"\.topbar--hero.is-solid \.topbar__search \{[\s\S]*?\}", """.topbar--hero.is-solid .topbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 44px;
  width: 60px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 18px;
  color: #0f172a;
  overflow: hidden;
  margin-inline-start: auto;
  box-shadow: 0 22px 38px -28px rgba(15, 23, 42, 0.25);
  transition: width 0.32s ease, background 0.32s ease, border 0.32s ease, box-shadow 0.32s ease, gap 0.24s ease;
}
""",)

replace(r"\.topbar--hero.is-solid \.topbar__search.is-open \{[\s\S]*?\}", """.topbar--hero.is-solid .topbar__search.is-open {
  width: 320px;
  padding-inline: 18px;
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(148, 163, 184, 0.42);
  box-shadow: 0 28px 46px -28px rgba(15, 23, 42, 0.3);
  gap: 12px;
}
""",)

replace(r'"\.topbar__search \{[\s\S]*?\}""', """.topbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 44px;
  width: 60px;
  padding: 0;
  background: rgba(148, 163, 255, 0.16);
  border: 1px solid rgba(148, 163, 255, 0.28);
  border-radius: 18px;
  color: #e2e8f0;
  overflow: hidden;
  margin-inline-start: auto;
  transition: width 0.32s ease, background 0.32s ease, border 0.32s ease, box-shadow 0.32s ease, gap 0.24s ease;
}
""")

replace(r'"\.topbar__search.is-open \{[\s\S]*?\}""', """.topbar__search.is-open {
  width: 320px;
  padding-inline: 18px;
  background: rgba(148, 163, 255, 0.22);
  border-color: rgba(148, 163, 255, 0.35);
  box-shadow: 0 25px 42px -28px rgba(15, 23, 42, 0.24);
  gap: 12px;
}
""")

replace(r'  ".topbar__search \{\s*\n', '  .topbar__search {
')
replace(r'  ".topbar__search.is-open \{\s*\n', '  .topbar__search.is-open {
')

path.write_text(css, encoding='utf-8')
