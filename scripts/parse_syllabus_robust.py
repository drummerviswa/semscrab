import pypdf
import re
import os
import json
import warnings
import sys
import logging

# Suppress all pypdf logging warnings to prevent buffer overflow/slowdowns
logging.getLogger("pypdf").setLevel(logging.CRITICAL)
warnings.filterwarnings("ignore")

# Force stdout/stderr to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

public_dir = r"D:\Programming\futureProjects\semscrab\public"
pdf_files = [f for f in os.listdir(public_dir) if f.lower().endswith('.pdf')]

print(f"Auto-discovered {len(pdf_files)} syllabus PDF files in public/ directory.")

credits_map = {}
cats = ['PCC', 'PEC', 'OEC', 'EEC', 'MC', 'FC', 'PC', 'HS', 'BS', 'ES', 'L', 'T', 'P', 'C']

for f in pdf_files:
    pdf_path = os.path.join(public_dir, f)
    print(f"\nProcessing: {f} ...")
    
    try:
        reader = pypdf.PdfReader(pdf_path)
        num_pages = len(reader.pages)
        
        # 1. Detect Regulation Year from first 15 pages or filename
        regulation = "2019" # Default
        reg_found = False
        
        # Scan first 15 pages for regulation year
        for idx in range(min(15, num_pages)):
            text = reader.pages[idx].extract_text()
            if not text:
                continue
            
            # Look for "Regulations 2023", "Regulations 2019", "Regulation 2023", "R-2023" etc.
            matches = re.findall(r'(?i)regulation[s]?\s*-?\s*(\d{4})|r\s*-\s*(\d{4})|r(\d{4})', text)
            if matches:
                for match in matches:
                    year = next((x for x in match if x), "")
                    if year and year.startswith("20"):
                        regulation = year
                        reg_found = True
                        break
            if reg_found:
                break
                
        if not reg_found:
            # Check filename for a year
            file_year_match = re.search(r'\b(20\d{2})\b', f)
            if file_year_match:
                regulation = file_year_match.group(1)
                
        print(f"  Detected Regulation: {regulation}")

        # 2. Detect Branch and Degree
        first_pages_text = ""
        for idx in range(min(5, num_pages)):
            t = reader.pages[idx].extract_text()
            if t:
                first_pages_text += " " + t
        first_pages_text_lower = first_pages_text.lower()
        
        filename_lower = f.lower()
        
        branch = "MSc Integrated Information Technology" # Fallback
        
        # Heuristics based on filename first, then text content
        if "cs" in filename_lower or "computer science" in filename_lower:
            branch = "MSc Computer Science (5 Years)"
        elif "it" in filename_lower or "information technology" in filename_lower:
            branch = "MSc Integrated Information Technology"
        elif "em" in filename_lower or "electronic media" in filename_lower or "media sciences" in filename_lower:
            branch = "MSc Electronic Media (5 Years)"
        elif "computer science" in first_pages_text_lower:
            branch = "MSc Computer Science (5 Years)"
        elif "information technology" in first_pages_text_lower:
            branch = "MSc Integrated Information Technology"
        elif "electronic media" in first_pages_text_lower or "media sciences" in first_pages_text_lower:
            branch = "MSc Electronic Media (5 Years)"
        else:
            clean_name = f.replace(".pdf", "")
            clean_name = re.sub(r'\b(20\d{2})\b', '', clean_name)
            clean_name = re.sub(r'[\(\)\-\_\s]+', ' ', clean_name).strip()
            branch = clean_name if len(clean_name) > 3 else f

        print(f"  Detected Branch: {branch}")

        # 3. Scan first 15 pages for course tables and credits
        limit = min(15, num_pages)
        for idx in range(limit):
            text = reader.pages[idx].extract_text()
            if not text:
                continue
                
            matches = list(re.finditer(r'\b([A-Z]{2,3}[0-9]{3,4})\b', text))
            
            for i, match in enumerate(matches):
                code = match.group(1)
                start_pos = match.end()
                
                end_pos = matches[i+1].start() if i + 1 < len(matches) else len(text)
                course_text = text[start_pos:end_pos].strip()
                
                consec_match = re.search(r'\b\d+(?:\s+\d+){3,4}\b', course_text)
                
                if consec_match:
                    block_text = consec_match.group(0)
                    block_nums = re.findall(r'\b\d+\b', block_text)
                    
                    if block_nums:
                        credits = int(block_nums[-1])
                        if 1 <= credits <= 20:
                            title_part = course_text.replace(block_text, "")
                            
                            nums = re.findall(r'\b\d+\b', title_part)
                            for num in nums:
                                title_part = title_part.replace(num, "")
                            for cat in cats:
                                title_part = re.sub(rf'\b{cat}\b', '', title_part)
                            
                            title = re.sub(r'\s+', ' ', title_part).strip()
                            title = re.sub(r'^[.\-\s]+', '', title)
                            title = re.sub(r'[.\-\s]+$', '', title)
                            
                            if code not in credits_map or len(title) > len(credits_map[code]['title']):
                                credits_map[code] = {
                                    'credits': credits,
                                    'title': title,
                                    'branch': branch,
                                    'regulation': regulation
                                }
                                
    except Exception as e:
        print(f"  Error processing {f}: {e}")

# Save output to public folder
output_path = os.path.join(public_dir, "credits_map.json")
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(credits_map, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully generated database! Found {len(credits_map)} unique subjects.")
print(f"Saved database to: {output_path}")
