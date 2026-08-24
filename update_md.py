import re
with open('IMAGE_GEN_TASK.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'\*\*Status\*\*: PENDING - image generation quota exhausted again until 2026-08-24 11:43 UTC \(04:43 PDT\)', '**Status**: PENDING - image generation quota exhausted again until 2026-08-30 15:34 UTC (08:34 PDT)', content)
content = re.sub(r'\*\*Last Updated\*\*: 2026-08-23 23:48 PDT', '**Last Updated**: 2026-08-24 04:52 PDT', content)
content = re.sub(r'## Completed Kits \(194 unique images generated & updated in Neon DB\)', '## Completed Kits (198 unique images generated & updated in Neon DB)', content)
content = re.sub(r'- Halloween \(STARTER, PREMIUM - 8 images\)', '- Halloween (STARTER, PREMIUM - 8 images)\n- Valentine\'s Day (STARTER - 4 images)', content)
content = re.sub(r'## Remaining Generation Queue \(46 images total across 12 kit tiers - Ranked by Priority\)', '## Remaining Generation Queue (42 images total across 11 kit tiers - Ranked by Priority)', content)
content = re.sub(r'1\. \*\*Valentine\'s Day\*\* \(STARTER 4 images, PREMIUM 4 images = 8 images\) — \*Ranked #2 US Popularity\*', '1. **Valentine\'s Day** (PREMIUM 4 images = 4 images) — *Ranked #2 US Popularity*', content)

with open('IMAGE_GEN_TASK.md', 'w', encoding='utf-8') as f:
    f.write(content)

