import os
import shutil
import glob

brain_dir = r"C:\Users\farbo\.gemini\antigravity-cli\brain\d8b9f463-caf4-41f7-9db1-e44414633abc"
target_dir_frontend = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
target_dir_backend = r"C:\Users\farbo\Documents\celebrease\backend\uploads\holidays"

os.makedirs(target_dir_frontend, exist_ok=True)
os.makedirs(target_dir_backend, exist_ok=True)

angle_mappings = {
    "lunar_new_year_angle2": "lunar-new-year-starter-angle2.jpg",
    "lunar_new_year_angle3": "lunar-new-year-starter-angle3.jpg",
    "lunar_new_year_angle4": "lunar-new-year-starter-angle4.jpg",
    "st_patricks_angle1": "st-patricks-day-starter-angle1.jpg",
    "st_patricks_angle2": "st-patricks-day-starter-angle2.jpg",
    "st_patricks_angle3": "st-patricks-day-starter-angle3.jpg",
    "st_patricks_angle4": "st-patricks-day-starter-angle4.jpg",
    "passover_angle1": "passover-starter-angle1.jpg",
    "passover_angle2": "passover-starter-angle2.jpg",
    "passover_angle3": "passover-starter-angle3.jpg",
    "passover_angle4": "passover-starter-angle4.jpg",
    "holi_angle1": "holi-starter-angle1.jpg",
    "holi_angle2": "holi-starter-angle2.jpg",
}

for key, target_filename in angle_mappings.items():
    pattern = os.path.join(brain_dir, f"{key}_*.jpg")
    matches = glob.glob(pattern)
    if matches:
        src = matches[-1]
        dst_f = os.path.join(target_dir_frontend, target_filename)
        dst_b = os.path.join(target_dir_backend, target_filename)
        shutil.copy(src, dst_f)
        shutil.copy(src, dst_b)
        print(f"Mapped {key} -> {target_filename}")

print("\nBatch 2 asset processing complete!")
