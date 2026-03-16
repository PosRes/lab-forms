import re

files = ['equipment-log.html', 'media-opening-record.html', 'reference-strain-record.html']

form_css = """<link rel="stylesheet" href="theme.css">
<style>
  .form-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; gap: 20px; flex-wrap: wrap; }
  .form-header h1 { font-size: 28px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
  .form-header p { font-size: 14px; color: var(--text-muted); }
  .doc-meta { font-family: var(--mono); font-size: 11px; color: var(--text-muted); text-align: right; line-height: 1.6; }
  
  .record-id-banner { background: var(--primary-light); border: 1px solid rgba(14,165,233,0.2); border-radius: 12px; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
  .record-id-label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: var(--primary); letter-spacing: 1px; margin-bottom: 4px; }
  .record-id-value { font-family: var(--mono); font-size: 20px; font-weight: 700; color: var(--text-main); }
  
  .req { color: var(--danger); font-weight: 700; }
  
  .radio-group, .checkbox-group { display: flex; gap: 12px; flex-wrap: wrap; }
  .rpill { display: flex; align-items: center; cursor: pointer; font-size: 14px; font-weight: 600; padding: 10px 16px; border: 1px solid rgba(0,0,0,0.1); border-radius: 20px; background: rgba(255,255,255,0.6); transition: all 0.2s; user-select: none; }
  .rpill input { display: none; }
  .rpill:has(input:checked) { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 4px 10px var(--primary-glow); }
  .cpill { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; padding: 10px 16px; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; background: rgba(255,255,255,0.6); transition: all 0.2s; }
  .cpill:has(input:checked) { background: rgba(16,185,129,0.1); border-color: var(--success); }
  
  .equip-selector { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
  .equip-btn { background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 16px; text-align: left; cursor: pointer; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
  .eq-icon { font-size: 28px; margin-bottom: 12px; }
  .eq-label { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
  .eq-sub { font-size: 11px; color: var(--text-muted); font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.5px; }
  .equip-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); background: #fff; }
  .equip-btn.active { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 0 0 2px var(--primary-light); }
  
  .run-log-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
  .run-log-table th { background: rgba(0,0,0,0.02); padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .run-log-table td { padding: 10px 16px; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .run-log-table input, .run-log-table select { width: 100%; border: none; background: transparent; font-family: var(--sans); font-size: 13px; outline: none; padding: 4px; }
  .run-log-table input:focus, .run-log-table select:focus { background: rgba(14,165,233,0.05); border-radius: 4px; }
  .run-log-table tr:last-child td { border-bottom: none; }
  
  #toast { position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%); background: var(--text-main); color: #fff; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.4s; z-index: 9999; }
  #toast.show { bottom: 32px; }
  
  .full-width { grid-column: 1 / -1; }
</style>
"""

for filepath in files:
    with open(filepath, 'r') as f:
        html = f.read()
    
    # Insert custom CSS
    html = html.replace('<link rel="stylesheet" href="theme.css">', form_css)

    # 1. Page Wrap
    html = html.replace('<div class="page-wrap">', '<div class="main-container scroll-animate delay-1">')
    
    # 2. Section Containers
    html = html.replace('<div class="section">', '<div class="glass-panel scroll-animate delay-2" style="margin-bottom: 24px; overflow:hidden;">')
    html = html.replace('<div class="section" id="sec-autoclave" style="display:none;">', '<div class="glass-panel scroll-animate delay-2" id="sec-autoclave" style="display:none; margin-bottom: 24px; overflow:hidden;">')
    html = html.replace('<div class="section" id="sec-bsc" style="display:none;">', '<div class="glass-panel scroll-animate delay-2" id="sec-bsc" style="display:none; margin-bottom: 24px; overflow:hidden;">')
    
    # 3. Section Headers
    html = html.replace('<div class="section-header">', '<div style="background:rgba(255,255,255,0.4); padding:16px 24px; border-bottom:1px solid rgba(0,0,0,0.05); display:flex; align-items:center; gap:12px; font-weight:800; border-radius:16px 16px 0 0;">')
    html = html.replace('<span class="section-num">', '<span style="background:var(--primary); color:#fff; font-family:var(--mono); padding:4px 8px; border-radius:6px; font-size:12px;">')
    html = html.replace('<span class="section-title">', '<span style="color:var(--text-main); font-size:16px;">')
    
    # 4. Section Bodies & Fields
    html = html.replace('<div class="section-body">', '<div style="padding:24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:24px;">')
    html = html.replace('<div class="field">', '<div class="input-group">')
    html = html.replace('<div class="field full-width">', '<div class="input-group full-width">')
    
    # 5. Inputs & Buttons
    html = re.sub(r'<input type="(text|date|number|time)" (.*?)>', r'<input type="\1" class="input-base" \2>', html)
    html = html.replace('<select id=', '<select class="input-base" id=')
    html = html.replace('<textarea ', '<textarea class="input-base" style="min-height:80px; resize:vertical; line-height:1.5;" ')
    html = html.replace('<button class="submit-btn"', '<button class="btn btn-primary scroll-animate delay-3" style="width:100%; padding:18px; font-size:16px; margin-top:24px; border-radius:16px;" ')
    
    # 6. Add Animations Script at EOF
    html = html.replace('</body>', '<script src="animations.js"></script>\n</body>')

    with open(filepath, 'w') as f:
        f.write(html)

print("Updated forms classes and layout styles via Python.")
