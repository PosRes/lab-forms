import re

# Wire each HTML page to its specific 3D background script
mappings = {
    'media-opening-record.html': '3d-bg-media.js',
    'reference-strain-record.html': '3d-bg-strain.js',
    'equipment-log.html': '3d-bg-equipment.js',
    # index.html and records-viewer.html keep generic 3d-bg.js
}

for html_file, js_file in mappings.items():
    try:
        with open(html_file, 'r') as f:
            content = f.read()

        # Replace the 3d-bg.js script reference with the specific one
        content = content.replace(
            '<script src="3d-bg.js"></script>',
            f'<script src="{js_file}"></script>'
        )

        with open(html_file, 'w') as f:
            f.write(content)
        print(f"✓ {html_file} → {js_file}")
    except Exception as e:
        print(f"✗ {html_file}: {e}")

print("Done wiring 3D scripts.")
