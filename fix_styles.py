import os

# CSS definitions for missing classes used in MOL and RSL forms
missing_css = """
  /* Section header bar */
  .section-title.glass-panel ~ div .section-title,
  div.section-title { background: rgba(14,165,233,0.06); padding: 16px 24px; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 16px; color: var(--text-main); border-radius: 16px 16px 0 0; }
  .num { background: var(--primary); color: #fff; font-family: var(--mono); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; }
  
  /* Grid layouts for form fields */
  .field-grid { display: grid; gap: 24px; }
  .field-grid.col-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .field-grid.col-3 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  
  /* Radio button styling (plain label+input style) */
  .radio-btn { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 600; padding: 10px 16px; border: 1px solid rgba(0,0,0,0.1); border-radius: 20px; background: rgba(255,255,255,0.85); color: var(--text-main); transition: all 0.2s; user-select: none; }
  .radio-btn input[type="radio"] { accent-color: var(--primary); width: 16px; height: 16px; cursor: pointer; }
  .radio-btn:has(input:checked) { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 4px 10px var(--primary-glow); }
  .radio-btn:has(input:checked) input[type="radio"] { accent-color: #fff; }
  
  /* Checkbox list styling */
  .checkbox-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .checkbox-list label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; padding: 8px 14px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; background: rgba(255,255,255,0.85); transition: all 0.2s; }
  .checkbox-list label:has(input:checked) { background: rgba(16,185,129,0.12); border-color: var(--success); color: var(--success); font-weight: 600; }
  .checkbox-list input[type="checkbox"] { accent-color: var(--success); width: 14px; height: 14px; cursor: pointer; }
  
  /* Hint and divider */
  .hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block; }
  .divider { border: none; border-top: 1px solid rgba(0,0,0,0.06); margin: 16px 0; }
  
  /* Sticky footer */
  .sticky-footer { position: sticky; bottom: 0; z-index: 50; padding: 16px 24px; background: rgba(255,255,255,0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: flex-end; gap: 12px; box-shadow: 0 -4px 20px rgba(0,0,0,0.04); }
"""

for html_file in ['media-opening-record.html', 'reference-strain-record.html']:
    if not os.path.exists(html_file):
        continue
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Check if already injected
    if '.radio-btn {' in content and '.field-grid {' in content:
        print(f"⏭ {html_file} — already has styles")
        continue
    
    # Inject before closing </style>
    content = content.replace('</style>', missing_css + '</style>', 1)
    
    with open(html_file, 'w') as f:
        f.write(content)
    print(f"✓ {html_file} — injected missing CSS")

print("Done.")
