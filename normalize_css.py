from pathlib import Path
import re

path = Path('src/App.css')
css = path.read_text(encoding='utf-8')

# Replace solid topbar subsection
pattern_solid = re.compile(r"\.topbar--hero\.is-solid \.topbar__badge \{[\s\S]*?\.topbar__row \{", re.M)
solid_block = """.topbar--hero.is-solid .topbar__badge {
  background: #ef4444;
}

.topbar--hero.is-solid .topbar__search {
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

.topbar--hero.is-solid .topbar__search.is-open {
  width: 320px;
  padding-inline: 18px;
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(148, 163, 184, 0.42);
  box-shadow: 0 28px 46px -28px rgba(15, 23, 42, 0.3);
  gap: 14px;
}

.topbar--hero.is-solid .topbar__search-toggle {
  color: #0f172a;
}

.topbar--hero.is-solid .topbar__search-input::placeholder {
  color: #94a3b8;
}

.topbar--hero.is-solid .topbar__shortcut {
  color: #475569;
  border-color: rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.12);
}

.topbar__row {
"""
css, count = pattern_solid.subn(solid_block + '.topbar__row {', css, count=1)
if count == 0:
    raise SystemExit('solid block not replaced')

# Replace quick-actions -> dashboard block
pattern_actions = re.compile(r"\.topbar__actions \{[\s\S]*?\.dashboard \{", re.M)
actions_block = """.topbar__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar__quick-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(9, 17, 36, 0.6);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 255, 0.22);
  backdrop-filter: blur(18px);
}

.topbar__round {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(140deg, rgba(45, 104, 240, 0.94) 0%, rgba(22, 82, 200, 0.9) 55%, rgba(15, 58, 162, 0.88) 100%);
  color: #e9f3ff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 16px 30px -18px rgba(37, 99, 235, 0.65);
}

.topbar__round:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 20px 36px -18px rgba(37, 99, 235, 0.78);
}

.topbar__badge {
  position: absolute;
  top: 6px;
  left: 6px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
}

.topbar__profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  border-radius: 20px;
  border: none;
  background: linear-gradient(135deg, rgba(42, 83, 196, 0.42) 0%, rgba(19, 38, 102, 0.58) 100%);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  box-shadow: 0 14px 28px -20px rgba(15, 23, 42, 0.6);
}

.topbar__profile:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(56, 130, 246, 0.6) 0%, rgba(24, 52, 133, 0.65) 100%);
  box-shadow: 0 18px 32px -20px rgba(12, 20, 48, 0.55);
}

.topbar__search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 44px;
  width: 60px;
  padding: 0;
  background: linear-gradient(135deg, rgba(28, 64, 155, 0.85) 0%, rgba(13, 33, 82, 0.9) 100%);
  border: 1px solid rgba(148, 163, 255, 0.32);
  border-radius: 18px;
  color: #e2e8f0;
  overflow: hidden;
  margin-inline-start: auto;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 18px 28px -20px rgba(15, 23, 42, 0.55);
  transition: width 0.32s ease, background 0.32s ease, border 0.32s ease, box-shadow 0.32s ease, gap 0.24s ease;
}

.topbar__search.is-open {
  width: 320px;
  padding-inline: 18px;
  background: rgba(15, 23, 42, 0.92);
  border-color: rgba(148, 163, 255, 0.42);
  box-shadow: 0 25px 42px -28px rgba(15, 23, 42, 0.35);
  gap: 14px;
}

.topbar__search-toggle {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: transparent;
  color: inherit;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.topbar__search-toggle:hover {
  transform: scale(1.05);
}

.topbar__search-input {
  flex: 1;
  width: 0;
  opacity: 0;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 15px;
  outline: none;
  padding: 0;
  margin-inline-start: 0;
  transition: opacity 0.2s ease 0.1s, margin-inline-start 0.2s ease, width 0.2s ease;
}

.topbar__search.is-open .topbar__search-input {
  width: 100%;
  opacity: 1;
  margin-inline-start: 12px;
}

.topbar__search-input::placeholder {
  color: rgba(226, 232, 240, 0.58);
}

.topbar__shortcut {
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 12px;
  color: rgba(226, 232, 240, 0.65);
  border: 1px solid transparent;
  background: transparent;
  opacity: 0;
  transform: translateX(8px);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.topbar__search.is-open .topbar__shortcut {
  opacity: 0.85;
  border-color: rgba(148, 163, 255, 0.28);
  background: rgba(148, 163, 255, 0.16);
  transform: translateX(0);
}

.dashboard {
"""
css, count2 = pattern_actions.subn(actions_block + '.dashboard {', css, count=1)
if count2 == 0:
    raise SystemExit('actions block not replaced')

path.write_text(css, encoding='utf-8')
