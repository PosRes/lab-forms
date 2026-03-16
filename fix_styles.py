import os

html_files = ['equipment-log.html', 'media-opening-record.html', 'reference-strain-record.html']

for f in html_files:
    if not os.path.exists(f): continue
    with open(f, 'r') as file:
        content = file.read()
    
    # Fix radio/checkbox pill backgrounds to match the dark theme
    content = content.replace('background: rgba(255,255,255,0.6);', 'background: rgba(10,15,30,0.65); color: var(--text-main);')
    content = content.replace('border: 1px solid rgba(0,0,0,0.1);', 'border: 1px solid rgba(255,255,255,0.15);')
    content = content.replace('background: rgba(16,185,129,0.1); border-color: var(--success);', 'background: rgba(16,185,129,0.25); border-color: var(--success); color: #fff;')
    
    # Equipment Selector buttons (also were white glass)
    content = content.replace('background: #fff;', 'background: rgba(255,255,255,0.1);')
    # Make sure text on those is also legible
    
    with open(f, 'w') as file:
        file.write(content)

print("Styles fixed.")
