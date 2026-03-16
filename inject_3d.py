import os

files = ['index.html', 'records-viewer.html', 'media-opening-record.html', 'reference-strain-record.html', 'equipment-log.html']

injection = """
<canvas id="bg-canvas"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="3d-bg.js"></script>
"""

for filepath in files:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        html = f.read()
    
    # Avoid duplicate injections
    if 'id="bg-canvas"' not in html:
        # Inject right before <script src="animations.js"></script> or </body>
        if '<script src="animations.js"></script>' in html:
            html = html.replace('<script src="animations.js"></script>', injection + '\n<script src="animations.js"></script>')
        else:
            html = html.replace('</body>', injection + '\n</body>')
        
        with open(filepath, 'w') as f:
            f.write(html)

print("Injected WebGL backgrounds into all files.")
