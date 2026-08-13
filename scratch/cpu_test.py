import time
import torch
from diffusers import AutoPipelineForText2Image

print("Loading SDXL-Turbo on CPU...")
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float32)
pipe.to("cpu")

print("Generating test image...")
start = time.time()
image = pipe(prompt="Professional high-end product photography of a Christmas celebration decoration kit.", num_inference_steps=2, guidance_scale=0.0).images[0]
end = time.time()

image.save("scratch/cpu_test.jpg")
print(f"Generated on CPU in {end - start:.2f} seconds.")
