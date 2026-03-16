import os

html_files = ['equipment-log.html', 'media-opening-record.html', 'reference-strain-record.html', 'records-viewer.html', 'index.html']

for f in html_files:
    if not os.path.exists(f): continue
    with open(f, 'r') as fh:
        content = fh.read()

    # Fix dark glass section headers -> light glass
    content = content.replace(
        'background:rgba(255,255,255,0.4); padding:16px 24px; border-bottom:1px solid rgba(0,0,0,0.05);',
        'background:rgba(14,165,233,0.06); padding:16px 24px; border-bottom:1px solid rgba(0,0,0,0.06);'
    )

    # Fix radio pill styles to light theme
    content = content.replace(
        'background: rgba(10,15,30,0.65); color: var(--text-main);',
        'background: rgba(255,255,255,0.85); color: var(--text-main);'
    )
    content = content.replace(
        'border: 1px solid rgba(255,255,255,0.15);',
        'border: 1px solid rgba(0,0,0,0.1);'
    )
    content = content.replace(
        'background: rgba(16,185,129,0.25); border-color: var(--success); color: #fff;',
        'background: rgba(16,185,129,0.12); border-color: var(--success);'
    )

    # Fix equipment selector buttons
    content = content.replace(
        'background: rgba(255,255,255,0.1);',
        'background: rgba(255,255,255,0.85);'
    )

    # Fix any edit drawer backgrounds (white)
    content = content.replace(
        'background:rgba(255,255,255,0.5);',
        'background:rgba(255,255,255,0.9);'
    )

    # Fix login overlay
    content = content.replace(
        'background: rgba(255,255,255,0.7); backdrop-filter: blur(24px)',
        'background: rgba(240,244,248,0.85); backdrop-filter: blur(24px)'
    )

    # Fix alert icon background
    content = content.replace(
        'background: rgba(255,255,255,0.8);',
        'background: rgba(255,255,255,0.95);'
    )

    # Fix run log table
    content = content.replace(
        'background: #fff;',
        'background: rgba(255,255,255,0.9);'
    )

    with open(f, 'w') as fh:
        fh.write(content)

print("All inline styles updated for bright lab theme.")
