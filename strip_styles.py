import re
import glob

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace <style>...</style> with <link rel="stylesheet" href="theme.css">
    # We use re.DOTALL to match across newlines
    new_content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="theme.css">', content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"Stripped styles from {filepath}")
