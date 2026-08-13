import json
import os
import torch
import random
from diffusers import AutoPipelineForText2Image

# Set up paths
PLAN_PATH = 'scratch/image_generation_plan.json'
OUT_DIR = 'frontend/public'

print("Loading model...")
# Using SDXL Turbo for lightning-fast high-quality generation
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
pipe.to("cuda")

# Read plan
with open(PLAN_PATH, 'r') as f:
    plan = json.load(f)

print(f"Loaded {len(plan)} images to generate.")

for i, task in enumerate(plan):
    out_path = os.path.join(OUT_DIR, task['imageName'].replace('/uploads/holidays/', 'uploads/holidays/'))
    if out_path.startswith('frontend/public/'):
        out_path = out_path # Already joined
    else:
        out_path = os.path.join(OUT_DIR, 'uploads', 'holidays', task['imageName'] + '.jpg')
        
    print(f"[{i+1}/{len(plan)}] Generating {task['imageName']}...")
    
    # Generate image with a completely random seed to guarantee uniqueness
    generator = torch.Generator("cuda").manual_seed(random.randint(0, 1000000))
    image = pipe(prompt=task['prompt'], num_inference_steps=4, guidance_scale=0.0, generator=generator).images[0]
    
    # Save
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    image.save(out_path)
    
print("All images generated successfully!")
