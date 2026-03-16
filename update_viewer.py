import re

with open('records-viewer.html', 'r') as f:
    html = f.read()

# 1. Structural Replacements
html = html.replace('<div class="page-wrap">', '<div class="main-container">')
html = html.replace('<div class="page-header">', '<div class="section-title scroll-animate delay-1" style="justify-content: space-between;">')
html = html.replace('<div class="tab-bar">', '<div class="tab-bar scroll-animate delay-2" style="display:flex; gap:12px; margin-bottom:24px; overflow-x:auto; padding-bottom:8px;">')
html = html.replace('<div class="toolbar">', '<div class="glass-panel toolbar scroll-animate delay-3" style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:16px 20px; margin-bottom:24px; justify-content:space-between;">')
html = html.replace('<div id="content">', '<div id="content" class="scroll-animate delay-4">')

# 2. Input and Select replacements
html = html.replace('<input type="text" id="search"', '<input type="text" class="input-base" id="search" style="width:100%; max-width:300px;" ')
html = html.replace('<select id="filter-eq-type"', '<select id="filter-eq-type" class="input-base"')
html = html.replace('<select id="filter-disposition"', '<select id="filter-disposition" class="input-base" style="max-width:200px;"')

# 3. Tab buttons
html = html.replace('class="tab-btn', 'class="btn btn-ghost" style="border-radius:20px; white-space:nowrap;"')

# 4. JS Template replacements for records
html = html.replace('<div class="record-card', '<div class="glass-panel record-card glass-panel-hover" style="margin-bottom:20px; overflow:hidden;"')
html = html.replace('<div class="card-header"', '<div class="card-header" style="padding:20px 24px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;"')
html = html.replace('<div class="card-detail">', '<div class="card-detail" style="display:none; padding:20px 24px; border-top:1px solid rgba(0,0,0,0.05); background:rgba(255,255,255,0.3);"')
html = html.replace('document.getElementById(`card-${idx}`).classList.toggle(\'open\');', '''
  const card = document.getElementById(`card-${idx}`);
  card.classList.toggle('open');
  const detail = card.querySelector('.card-detail');
  detail.style.display = card.classList.contains('open') ? 'block' : 'none';
''')

# 5. Badges
html = html.replace('<span class="tab-count"', '<span class="badge badge-pending" style="margin-left:8px;" ')

# 6. Detail Grid Layout
html = html.replace('<div class="detail-sections">', '<div class="detail-sections" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">')
html = html.replace('<div class="detail-section">', '<div class="detail-section" style="display:flex; flex-direction:column; gap:8px;">')
html = html.replace('<div class="detail-row">', '<div class="detail-row" style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px dashed rgba(0,0,0,0.05); font-size:13px;">')
html = html.replace('<span class="detail-key">', '<span class="detail-key" style="color:var(--text-muted); font-weight:600;">')
html = html.replace('<span class="detail-val', '<span class="detail-val" style="font-weight:600; color:var(--text-main);" ')

# 7. Card Layout additions
html = html.replace('<div class="card-header-left">', '<div class="card-header-left" style="display:flex; flex-direction:column; gap:6px;">')
html = html.replace('<span class="record-id">', '<span class="record-id" style="font-family:var(--mono); color:var(--primary); font-weight:700; font-size:12px; background:var(--primary-light); padding:2px 8px; border-radius:4px; align-self:flex-start;">')
html = html.replace('<span class="media-name">', '<span class="media-name" style="font-size:18px; font-weight:700;">')
html = html.replace('<span class="card-meta">', '<span class="card-meta" style="font-size:12px; color:var(--text-muted); font-family:var(--mono);">')
html = html.replace('<div class="card-badges">', '<div class="card-badges" style="display:flex; gap:8px; align-items:center;">')
html = html.replace('<div class="card-actions">', '<div class="card-actions" style="display:flex; gap:12px; margin-top:24px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.05);">')

# 8. Modals & Drawers Layout
html = html.replace('<div class="edit-backdrop"', '<div class="edit-backdrop" style="display:none; position:fixed; inset:0; background:rgba(255,255,255,0.5); backdrop-filter:blur(10px); z-index:900;" ')
html = html.replace('<div class="edit-drawer"', '<div class="edit-drawer glass-panel" style="position:fixed; top:0; right:-100%; width:min(600px,100vw); height:100vh; z-index:901; transition:right 0.3s ease; display:flex; flex-direction:column; border-radius:0; border-left:1px solid rgba(255,255,255,0.8);" ')
html = html.replace('<div class="edit-drawer-header"', '<div class="edit-drawer-header" style="display:flex; justify-content:space-between; padding:20px; border-bottom:1px solid rgba(0,0,0,0.05); background:rgba(255,255,255,0.5);" ')
html = html.replace('<div class="edit-drawer-body"', '<div class="edit-drawer-body" style="flex:1; overflow-y:auto; padding:24px;" ')
html = html.replace('<div class="edit-drawer-footer">', '<div class="edit-drawer-footer" style="padding:20px; border-top:1px solid rgba(0,0,0,0.05); background:rgba(255,255,255,0.5); display:flex; gap:12px;">')

# Edit form inputs
html = html.replace('class="edit-input"', 'class="input-base"')
html = html.replace('class="edit-label"', 'style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;"')
html = html.replace('<div class="edit-field-grid">', '<div class="edit-field-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">')
html = html.replace('<div class="edit-field', '<div class="edit-field" style="display:flex; flex-direction:column; gap:4px;" ')
html = html.replace('<div class="edit-section-title', '<div class="edit-section-title" style="font-size:12px; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:12px; margin-top:24px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.05);" ')

# JS to open/close drawer properly
html = html.replace("document.getElementById('edit-drawer').classList.add('open');", "document.getElementById('edit-drawer').style.right='0';")
html = html.replace("document.getElementById('edit-drawer').classList.remove('open');", "document.getElementById('edit-drawer').style.right='-100%';")
html = html.replace("document.getElementById('edit-backdrop').classList.add('show');", "document.getElementById('edit-backdrop').style.display='block';")
html = html.replace("document.getElementById('edit-backdrop').classList.remove('show');", "document.getElementById('edit-backdrop').style.display='none';")

# 9. Link animations
html = html.replace('</body>', '<script src="animations.js"></script>\n</body>')

with open('records-viewer.html', 'w') as f:
    f.write(html)

print("Updated records-viewer.html classes and layout styles via Python.")
