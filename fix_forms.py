import re

# ══════════════════════════════════════
# FIX 1: MOL — Convert checkbox list to pill buttons, fix sign-off, move status bar
# ══════════════════════════════════════

with open('media-opening-record.html', 'r') as f:
    mol = f.read()

# 1a) Add .check-item styling as cpill-style buttons
check_item_css = """
  .check-item { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; padding: 8px 16px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; background: rgba(255,255,255,0.9); transition: all 0.2s; user-select: none; }
  .check-item input[type="checkbox"] { display: none; }
  .check-item:has(input:checked) { background: var(--warning-light); border-color: var(--warning); color: #92400e; font-weight: 600; }
  .check-item:hover { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.3); }
  .checklist { display: flex; flex-wrap: wrap; gap: 8px; }
  .status-bar { padding: 12px 24px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; border-top: 1px solid rgba(0,0,0,0.05); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
  .signoff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
  .sig-box { border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; }
  .sig-box-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); padding: 10px 16px; background: rgba(0,0,0,0.02); }
  .sig-box-body { padding: 16px; }
"""
mol = mol.replace('</style>', check_item_css + '</style>', 1)

# 1b) Replace the sign-off section — simplify to just Analyst Name + Date
old_signoff_mol = """      <div class="signoff-grid">
        <div class="sig-box">
          <div class="sig-box-label">Opened By (Analyst)</div>
          <div class="sig-box-body">
            <div class="input-group">
              <label>Full Name</label>
              <input type="text" class="input-base" id="analyst-name" placeholder="Name">
            </div>
            <div class="input-group">
              <label>Initials / Staff ID</label>
              <input type="text" class="input-base" class="mono" id="analyst-id" placeholder="e.g. KAR / LB-007">
            </div>
            <div class="input-group">
              <label>Date</label>
              <input type="date" class="input-base" id="analyst-date">
            </div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-box-label">QC Verified By</div>
          <div class="sig-box-body">
            <div class="input-group">
              <label>Full Name</label>
              <input type="text" class="input-base" id="qc-name" placeholder="Name">
            </div>
            <div class="input-group">
              <label>Initials / Staff ID</label>
              <input type="text" class="input-base" class="mono" id="qc-id" placeholder="e.g. JDW / QC-003">
            </div>
            <div class="input-group">
              <label>Date</label>
              <input type="date" class="input-base" id="qc-date">
            </div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-box-label">Reviewed By (Supervisor)</div>
          <div class="sig-box-body">
            <div class="input-group">
              <label>Full Name</label>
              <input type="text" class="input-base" id="sup-name" placeholder="Name">
            </div>
            <div class="input-group">
              <label>Initials / Staff ID</label>
              <input type="text" class="input-base" class="mono" id="sup-id" placeholder="e.g. MH / SP-001">
            </div>
            <div class="input-group">
              <label>Date</label>
              <input type="date" class="input-base" id="sup-date">
            </div>
          </div>
        </div>
      </div>"""

new_signoff_mol = """      <div class="field-grid col-2">
        <div class="input-group">
          <label><span class="req">*</span> Analyst Name</label>
          <input type="text" class="input-base" id="analyst-name" placeholder="Full name">
        </div>
        <div class="input-group">
          <label><span class="req">*</span> Date</label>
          <input type="date" class="input-base" id="analyst-date">
        </div>
      </div>"""

mol = mol.replace(old_signoff_mol, new_signoff_mol)

with open('media-opening-record.html', 'w') as f:
    f.write(mol)
print("✓ MOL — checkbox styles + simplified sign-off")


# ══════════════════════════════════════
# FIX 2: RSL — Convert checkbox list, fix BSL inline, fix sign-off
# ══════════════════════════════════════

with open('reference-strain-record.html', 'r') as f:
    rsl = f.read()

# 2a) Add same .check-item styling + .warn-item variant
check_item_css_rsl = """
  .check-item { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; padding: 8px 16px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; background: rgba(255,255,255,0.9); transition: all 0.2s; user-select: none; }
  .check-item input[type="checkbox"] { display: none; }
  .check-item:has(input:checked) { background: var(--warning-light); border-color: var(--warning); color: #92400e; font-weight: 600; }
  .check-item:hover { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.3); }
  .checklist { display: flex; flex-wrap: wrap; gap: 8px; }
  .status-bar { padding: 12px 24px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; border-top: 1px solid rgba(0,0,0,0.05); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
  .signoff-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
  .sig-box { border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; overflow: hidden; }
  .sig-box-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); padding: 10px 16px; background: rgba(0,0,0,0.02); }
  .sig-box-body { padding: 16px; }
"""
rsl = rsl.replace('</style>', check_item_css_rsl + '</style>', 1)

# 2b) Add .checklist wrapper class to receipt inspection checkboxes
# The RSL checkboxes are also in a plain container - add wrap
rsl = rsl.replace(
    '<label class="check-item warn-item">',
    '<label class="check-item">'
)

# Wrap the RSL defects in a .checklist div if not already
if 'class="checklist"' not in rsl.split('Receipt Inspection')[1].split('</div>')[0]:
    rsl = rsl.replace(
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;font-family:var(--mono);">Tick all defects observed. Leave unchecked if not present.</p>\n      <div>',
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;font-family:var(--mono);">Tick all defects observed. Leave unchecked if not present.</p>\n      <div class="checklist">'
    )

# 2c) Fix BSL radio-group to stay inline (flex-wrap: nowrap)
rsl = rsl.replace(
    '<label class="radio-btn"><input type="radio" name="bsl" value="BSL-1"> BSL-1</label>\n            <label class="radio-btn"><input type="radio" name="bsl" value="BSL-2"> BSL-2</label>\n            <label class="radio-btn"><input type="radio" name="bsl" value="BSL-3"> BSL-3</label>',
    '<label class="rpill"><input type="radio" name="bsl" value="BSL-1"> BSL-1</label>\n            <label class="rpill"><input type="radio" name="bsl" value="BSL-2"> BSL-2</label>\n            <label class="rpill"><input type="radio" name="bsl" value="BSL-3"> BSL-3</label>'
)

# 2d) Replace ALL radio-btn with rpill in RSL for consistent styling
rsl = rsl.replace('class="radio-btn"', 'class="rpill"')

# 2e) Replace RSL sign-off with simplified version
old_signoff_rsl = """      <div class="signoff-grid">
        <div class="sig-box">
          <div class="sig-box-label">Received / Prepared By</div>
          <div class="sig-box-body">
            <div class="input-group"><label>Full Name</label><input type="text" class="input-base" id="analyst-name" placeholder="Name"></div>
            <div class="input-group"><label>Staff ID</label><input type="text" class="input-base" class="mono" id="analyst-id" placeholder="e.g. KAR-007"></div>
            <div class="input-group"><label>Date</label><input type="date" class="input-base" id="analyst-date"></div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-box-label">QC Verified By</div>
          <div class="sig-box-body">
            <div class="input-group"><label>Full Name</label><input type="text" class="input-base" id="qc-name" placeholder="Name"></div>
            <div class="input-group"><label>Staff ID</label><input type="text" class="input-base" class="mono" id="qc-id" placeholder="e.g. JDW-003"></div>
            <div class="input-group"><label>Date</label><input type="date" class="input-base" id="qc-date"></div>
          </div>
        </div>
        <div class="sig-box">
          <div class="sig-box-label">Reviewed By (Supervisor)</div>
          <div class="sig-box-body">
            <div class="input-group"><label>Full Name</label><input type="text" class="input-base" id="sup-name" placeholder="Name"></div>
            <div class="input-group"><label>Staff ID</label><input type="text" class="input-base" class="mono" id="sup-id" placeholder="e.g. MH-001"></div>
            <div class="input-group"><label>Date</label><input type="date" class="input-base" id="sup-date"></div>
          </div>
        </div>
      </div>"""

new_signoff_rsl = """      <div class="field-grid col-2">
        <div class="input-group">
          <label><span class="req">*</span> Analyst Name</label>
          <input type="text" class="input-base" id="analyst-name" placeholder="Full name">
        </div>
        <div class="input-group">
          <label><span class="req">*</span> Date</label>
          <input type="date" class="input-base" id="analyst-date">
        </div>
      </div>"""

rsl = rsl.replace(old_signoff_rsl, new_signoff_rsl)

with open('reference-strain-record.html', 'w') as f:
    f.write(rsl)
print("✓ RSL — checkbox styles + BSL rpill + simplified sign-off")

print("\nAll fixes applied!")
