import os
import shutil
import glob
import json

# Copy generated images from artifact folder to public/uploads/holidays/
brain_dir = r"C:\Users\farbo\.gemini\antigravity-cli\brain\d8b9f463-caf4-41f7-9db1-e44414633abc"
target_dir_frontend = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
target_dir_backend = r"C:\Users\farbo\Documents\celebrease\backend\uploads\holidays"

os.makedirs(target_dir_frontend, exist_ok=True)
os.makedirs(target_dir_backend, exist_ok=True)

image_mapping = {
    "thanksgiving_decor": "thanksgiving.jpg",
    "july4th_decor": "independence-day.jpg",
    "lunar_new_year_decor": "lunar-new-year.jpg",
    "dia_de_muertos_decor": "dia-de-los-muertos.jpg",
    "st_patricks_decor": "st-patricks-day.jpg",
    "passover_decor": "passover.jpg",
    "holi_decor": "holi.jpg",
    "cinco_de_mayo_decor": "cinco-de-mayo.jpg",
    "graduations_decor": "graduations.jpg",
    "weddings_decor": "weddings.jpg",
    "gender_reveal_decor": "gender-reveals.jpg",
}

copied_files = {}

for key, target_filename in image_mapping.items():
    pattern = os.path.join(brain_dir, f"{key}_*.jpg")
    matches = glob.glob(pattern)
    if matches:
        src = matches[-1]
        dst_f = os.path.join(target_dir_frontend, target_filename)
        dst_b = os.path.join(target_dir_backend, target_filename)
        shutil.copy(src, dst_f)
        shutil.copy(src, dst_b)
        copied_files[key] = f"/uploads/holidays/{target_filename}"
        print(f"Copied {key} -> {target_filename}")

print(f"\nTotal unique AI images processed: {len(copied_files)}")
