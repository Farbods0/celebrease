import os
import torch
from diffusers import AutoPipelineForText2Image
import time
import re

# Parse photo_gen_task.md to get the prompts
task_file = "C:/Users/farbo/Documents/celebrease/photo_gen_task.md"
with open(task_file, "r") as f:
    lines = f.readlines()

prompts = {}
current_holiday_tier = None
slug_map = {
    "New Year's": "new-years",
    "Ramadan": "ramadan",
    "Christmas": "christmas",
    "Birthdays": "birthdays",
    "Valentine's Day": "valentines-day",
    "Halloween": "halloween"
}

for line in lines:
    m = re.match(r"### \d+\. (.*) (STARTER|PREMIUM|ULTIMATE)", line)
    if m:
        holiday = m.group(1).strip()
        tier = m.group(2).strip().lower()
        if holiday in slug_map:
            current_holiday_tier = f"{slug_map[holiday]}-{tier}"
        else:
            current_holiday_tier = None
        continue
    
    if current_holiday_tier and line.startswith("- Photo"):
        # e.g. - Photo 2 (ny_std_2): Close beauty detail...
        m_prompt = re.search(r"Photo (\d+) \([^)]+\):\s*(.*)", line)
        if m_prompt:
            num = m_prompt.group(1)
            prompt = m_prompt.group(2).strip()
            filename = f"{current_holiday_tier}-angle{num}.jpg"
            prompts[filename] = prompt

print(f"Found {len(prompts)} prompts to generate.")

print("Loading SDXL-Turbo on CUDA...")
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
pipe.to("cuda")

base_path = "C:/Users/farbo/Documents/celebrease/frontend/public/uploads/holidays"

start = time.time()
for fname, prompt in prompts.items():
    out_path = os.path.join(base_path, fname)
    print(f"Generating {fname}...")
    # SDXL Turbo works in 1-4 steps. We use 4 for best quality.
    image = pipe(prompt=prompt, num_inference_steps=4, guidance_scale=0.0).images[0]
    image.save(out_path)

print(f"Done in {time.time()-start:.2f}s")
