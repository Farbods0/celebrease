import os
from diffusers import AutoPipelineForText2Image
import torch

queue = {
  "Christmas": ["STARTER", "PREMIUM", "ULTIMATE"],
  "Gender Reveals": ["STARTER", "PREMIUM", "ULTIMATE"],
  "Weddings": ["STARTER", "PREMIUM", "ULTIMATE"],
  "Baby Showers": ["STARTER", "PREMIUM"],
  "Birthdays": ["STARTER", "PREMIUM"],
  "Diwali": ["STARTER", "PREMIUM"],
  "Easter": ["STARTER", "PREMIUM"],
  "Eid": ["STARTER", "PREMIUM"],
  "Engagement Parties": ["STARTER", "PREMIUM"],
  "Halloween": ["STARTER", "PREMIUM"],
  "Hanukkah": ["STARTER", "PREMIUM"],
  "New Year's": ["STARTER", "PREMIUM"],
  "Nowruz": ["STARTER", "PREMIUM"],
  "Ramadan": ["STARTER", "PREMIUM"],
  "Valentine's Day": ["STARTER", "PREMIUM"],
  "St. Patricks Day": ["ULTIMATE"],
  "Thanksgiving": ["PREMIUM", "ULTIMATE"]
}

print("Loading SDXL-Turbo on 5090...")
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
pipe.to("cuda")

out_dir = r"C:\Users\farbo\Documents\celebrease\frontend\public\uploads\holidays"
os.makedirs(out_dir, exist_ok=True)

import json
results = []

for holiday, tiers in queue.items():
    slug = holiday.lower().replace("'", "").replace(" & ", "-").replace(" ", "-")
    for tier in tiers:
        print(f"Generating for {holiday} - {tier}...")
        images = []
        for i in range(1, 5):
            prompt = f"Professional product photography of a beautiful {tier.lower()} {holiday} party decoration kit, aesthetic, high quality, 4k"
            img = pipe(prompt=prompt, num_inference_steps=2, guidance_scale=0.0).images[0]
            filename = f"{slug}-{tier.lower()}-angle{i}.jpg"
            filepath = os.path.join(out_dir, filename)
            img.save(filepath, quality=90)
            images.append(f"/uploads/holidays/{filename}")
            
        results.append({
            "holiday": holiday,
            "tier": tier,
            "images": images
        })

with open("generation_results.json", "w") as f:
    json.dump(results, f)

print("Generation complete!")
