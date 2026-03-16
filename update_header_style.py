import re

files = ['media-opening-record.html', 'reference-strain-record.html']

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # The old CSS looks exactly like this:
    # .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-main); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
    # .section-title::after { content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.1); }
    # .num { background: var(--primary); color: #fff; border-radius: 6px; padding: 4px 8px; font-size: 13px; font-family: var(--mono); }
    
    # We will use regex to remove these specific lines, or anything resembling them.
    content = re.sub(r'\.section-title\s*{[^}]*}', '', content)
    content = re.sub(r'\.section-title::after\s*{[^}]*}', '', content)
    content = re.sub(r'\.num\s*{[^}]*}', '', content)
    
    # But wait, my fix_styles.py injected `div.section-title { ... }` and `.num { ... }`
    # The regex \.num { ... } will match both! The old one and the new one.
    # So I should also just re-inject the clean, correct CSS right before </style>.
    
    new_css = """
  .section-title { 
    background: rgba(14,165,233,0.06); 
    padding: 16px 24px; 
    border-bottom: 1px solid rgba(0,0,0,0.06); 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    font-weight: 800; 
    font-size: 16px; 
    color: var(--text-main); 
    border-radius: 16px 16px 0 0; 
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .section-title::after { display: none; }
  .num { 
    background: var(--primary); 
    color: #fff; 
    font-family: var(--mono); 
    padding: 4px 8px; 
    border-radius: 6px; 
    font-size: 12px; 
    font-weight: 700; 
  }
"""
    # Remove fix_styles div.section-title as well to be safe
    content = re.sub(r'div\.section-title\s*{[^}]*}', '', content)
    content = re.sub(r'\.section-title\.glass-panel ~ div \.section-title,\s*div\.section-title\s*{[^}]*}', '', content)
    content = re.sub(r'/\* Section header bar \*/', '', content)

    # Insert clean CSS
    content = content.replace('</style>', new_css + '\n</style>', 1)
    
    with open(file, 'w') as f:
        f.write(content)

print("Cleaned up and synchronized section-title CSS for MOL and RSL")
