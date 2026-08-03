import os
import shutil
import glob

brain_dir = r"C:\Users\farbo\.gemini\antigravity-cli\brain\d8b9f463-caf4-41f7-9db1-e44414633abc"
target_dir_frontend = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
target_dir_backend = r"C:\Users\farbo\Documents\celebrease\backend\uploads\holidays"

os.makedirs(target_dir_frontend, exist_ok=True)
os.makedirs(target_dir_backend, exist_ok=True)

angle_mappings = {
    "thanksgiving_angle1": "thanksgiving-starter-angle1.jpg",
    "thanksgiving_angle2": "thanksgiving-starter-angle2.jpg",
    "thanksgiving_angle3": "thanksgiving-starter-angle3.jpg",
    "thanksgiving_angle4": "thanksgiving-starter-angle4.jpg",
    "july4th_angle1": "independence-day-starter-angle1.jpg",
    "july4th_angle2": "independence-day-starter-angle2.jpg",
    "july4th_angle3": "independence-day-starter-angle3.jpg",
    "july4th_angle4": "independence-day-starter-angle4.jpg",
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

print("\nAsset processing complete!")
