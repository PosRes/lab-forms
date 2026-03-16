import re

# ── Rename in media-opening-record.html ──
with open('media-opening-record.html', 'r') as f:
    c = f.read()
c = c.replace('Media Opening Record', 'Media Opening Log')
c = c.replace('QC-MOR-001', 'QC-MOL-001')
c = c.replace("MOR-—", "MOL-—")
c = c.replace("MOR-fetching", "MOL-fetching")
c = c.replace("return `MOR-", "return `MOL-")
c = c.replace("startsWith('MOR-", "startsWith('MOL-")
c = c.replace("supabaseNextId('MOR-'", "supabaseNextId('MOL-'")
with open('media-opening-record.html', 'w') as f:
    f.write(c)
print("✓ media-opening-record.html")

# ── Rename in reference-strain-record.html ──
with open('reference-strain-record.html', 'r') as f:
    c = f.read()
c = c.replace('Reference Strain Record', 'Reference Strain Log')
c = c.replace('QC-RSR-001', 'QC-RSL-001')
c = c.replace("RSR-—", "RSL-—")
c = c.replace("RSR-fetching", "RSL-fetching")
c = c.replace("return `RSR-", "return `RSL-")
c = c.replace("startsWith('RSR-", "startsWith('RSL-")
c = c.replace("supabaseNextId('RSR-'", "supabaseNextId('RSL-'")
with open('reference-strain-record.html', 'w') as f:
    f.write(c)
print("✓ reference-strain-record.html")

# ── Rename display text in index.html ──
with open('index.html', 'r') as f:
    c = f.read()
c = c.replace('Media Opening Record', 'Media Opening Log')
c = c.replace('Reference Strain Record', 'Reference Strain Log')
c = c.replace('QC-MOR-001', 'QC-MOL-001')
c = c.replace('QC-RSR-001', 'QC-RSL-001')
c = c.replace('MOR-20260310-0001', 'MOL-20260310-0001')
c = c.replace('>MOR/RSR<', '>MOL/RSL<')
c = c.replace('>MOR<', '>MOL<')
c = c.replace('>RSR<', '>RSL<')
with open('index.html', 'w') as f:
    f.write(c)
print("✓ index.html")

# ── Rename tab labels in records-viewer.html ──
with open('records-viewer.html', 'r') as f:
    c = f.read()
c = c.replace('Media Opening Records', 'Media Opening Logs')
c = c.replace('Reference Strain Records', 'Reference Strain Logs')
c = c.replace('Media Opening Record', 'Media Opening Log')
c = c.replace('Reference Strain Record', 'Reference Strain Log')
c = c.replace('QC-MOR-001', 'QC-MOL-001')
c = c.replace('QC-RSR-001', 'QC-RSL-001')
# Update ID prefix display (badge rendering)
c = c.replace("startsWith('MOR')", "startsWith('MOL')")
c = c.replace("startsWith('MOR-')", "startsWith('MOL-')")
c = c.replace("startsWith('RSR')", "startsWith('RSL')")
c = c.replace("startsWith('RSR-')", "startsWith('RSL-')")
with open('records-viewer.html', 'w') as f:
    f.write(c)
print("✓ records-viewer.html")

print("All renaming complete.")
