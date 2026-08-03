import os
import glob

def clean_files():
    html_files = glob.glob('*.html')
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if the file contains the characters
        if 'Â·' in content or 'Â©' in content:
            new_content = content.replace('Â·', '·').replace('Â©', '©')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned {file_path}")

if __name__ == '__main__':
    clean_files()
