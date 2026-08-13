import os
import torch
from diffusers import AutoPipelineForText2Image
import time

prompts = {
    "thanksgiving-premium-angle1.jpg": "beautiful modern Thanksgiving premium kit decor setting, elegant dining table, warm autumn colors, photorealistic, 8k",
    "thanksgiving-premium-angle2.jpg": "close up of a beautiful modern Thanksgiving premium centerpiece, pumpkins, candles, autumn leaves, high quality, sharp focus, 8k",
    "thanksgiving-premium-angle3.jpg": "Thanksgiving premium kit decor, a beautifully styled living room corner with autumn decorations, professional lighting, 8k",
    "thanksgiving-premium-angle4.jpg": "Thanksgiving premium kit flat lay of decorative items, fall leaves, small gourds, elegant napkins, studio lighting, top down view, 8k",
    "thanksgiving-ultimate-angle1.jpg": "luxurious Thanksgiving ultimate kit decor, massive elegant dining table setup, extravagant autumn decorations, photorealistic, 8k",
    "thanksgiving-ultimate-angle2.jpg": "close up of a luxurious Thanksgiving ultimate centerpiece with rich fall foliage, gold accents, pumpkins, sharp focus, 8k",
    "thanksgiving-ultimate-angle3.jpg": "Thanksgiving ultimate kit decor, beautifully styled luxury fireplace mantle with rich autumn decor, professional lighting, 8k",
    "thanksgiving-ultimate-angle4.jpg": "Thanksgiving ultimate kit top down flat lay of extravagant decorative items, rich autumn tones, high end, studio lighting, 8k"
}

print("Loading SDXL-Turbo on CUDA...")
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
pipe.to("cuda")

base_path = "C:/Users/farbo/Documents/celebrease/frontend/public/uploads/holidays"

start = time.time()
for fname, prompt in prompts.items():
    out_path = os.path.join(base_path, fname)
    print(f"Generating {fname}...")
    image = pipe(prompt=prompt, num_inference_steps=4, guidance_scale=0.0).images[0]
    image.save(out_path)

print(f"Done in {time.time()-start:.2f}s")
