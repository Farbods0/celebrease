import os
import shutil
import glob

brain_dir = r"C:\Users\farbo\.gemini\antigravity-cli\brain\d8b9f463-caf4-41f7-9db1-e44414633abc"
target_dir_frontend = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
target_dir_backend = r"C:\Users\farbo\Documents\celebrease\backend\uploads\holidays"

os.makedirs(target_dir_frontend, exist_ok=True)
os.makedirs(target_dir_backend, exist_ok=True)

angle_mappings = {
    "holi_angle3": "holi-starter-angle3.jpg",
    "holi_angle4": "holi-starter-angle4.jpg",
    "cinco_de_mayo_angle1": "cinco-de-mayo-starter-angle1.jpg",
    "cinco_de_mayo_angle2": "cinco-de-mayo-starter-angle2.jpg",
    "cinco_de_mayo_angle3": "cinco-de-mayo-starter-angle3.jpg",
    "cinco_de_mayo_angle4": "cinco-de-mayo-starter-angle4.jpg",
    "graduations_angle1": "graduations-starter-angle1.jpg",
    "graduations_angle2": "graduations-starter-angle2.jpg",
    "graduations_angle3": "graduations-starter-angle3.jpg",
    "graduations_angle4": "graduations-starter-angle4.jpg",
    "weddings_angle1": "weddings-starter-angle1.jpg",
    "weddings_angle2": "weddings-starter-angle2.jpg",
    "weddings_angle3": "weddings-starter-angle3.jpg",
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

print("\nBatch 3 asset processing complete!")
