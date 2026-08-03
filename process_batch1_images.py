import os
import shutil
import glob

brain_dir = r"C:\Users\farbo\.gemini\antigravity-cli\brain\d8b9f463-caf4-41f7-9db1-e44414633abc"
target_dir_frontend = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
target_dir_backend = r"C:\Users\farbo\Documents\celebrease\backend\uploads\holidays"

os.makedirs(target_dir_frontend, exist_ok=True)
os.makedirs(target_dir_backend, exist_ok=True)

angle_mappings = {
    "dia_de_muertos_angle1": "dia-de-los-muertos-starter-angle1.jpg",
    "dia_de_muertos_angle2": "dia-de-los-muertos-starter-angle2.jpg",
    "dia_de_muertos_angle3": "dia-de-los-muertos-starter-angle3.jpg",
    "dia_de_muertos_angle4": "dia-de-los-muertos-starter-angle4.jpg",
    "lunar_new_year_angle1": "lunar-new-year-starter-angle1.jpg",
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

print("\nBatch 1 asset processing complete!")
