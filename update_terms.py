import re
import os

files = ['index.html', 'records-viewer.html', 'media-opening-record.html', 'reference-strain-record.html', 'equipment-log.html']

for filename in files:
    if not os.path.exists(filename): continue
    with open(filename, 'r') as f:
        content = f.read()

    # Terminology updates
    content = content.replace('Premium Workspace', 'Digital Workspace')
    content = content.replace('Premium Cloud Edition', 'Cloud Edition')
    content = content.replace('via Supabase', 'via SQL Database')
    content = content.replace('from your Google Sheet', 'from the database')
    content = content.replace('Save to Sheet', 'Save to Database')
    content = content.replace('saveToSheet()', 'saveToDatabase()')
    
    # EQL ID generation update
    if filename == 'equipment-log.html':
        content = content.replace("await supabaseNextId(prefix + '-' + dateStr, seqName);", "await supabaseNextId('EQL-' + dateStr, seqName);")
        # Ensure the form UI display is consistent too if it uses the prefix logic
        # For the display:
        content = content.replace("document.getElementById('record-id-display').textContent = 'EQL-' + prefix + '-' + dateStr + '-XXXX';", "document.getElementById('record-id-display').textContent = 'EQL-' + dateStr + '-XXXX';")
    
    # MOR & RSR display (already fine, but let's make sure 'saveToSheet' isn't used in JS)
    
    with open(filename, 'w') as f:
        f.write(content)

print("Terms and ID formats updated.")
