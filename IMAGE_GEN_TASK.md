# CeleBrease Image Generation Task
**Status**: PENDING - image generation quota exhausted again until 2026-08-23 20:43 UTC (13:43 PDT)
**Last Updated**: 2026-08-23 08:50 PDT

## Rule & Logic
* **Tier Differentiation**: Every tier (STARTER, PREMIUM, ULTIMATE) of every holiday must have **4 unique product photography images**.
* **STARTER Fixes**: Almost all STARTER kits were found to have duplicated placeholder images. They must ALL be regenerated, except for a few like Thanksgiving and St. Patrick's Day which were verified correct.
* **Generation Need**: 144 images total across 36 kit tiers.

## Resume Prompt (copy-paste this to restart when quota resets)
"Resume the image generation task. The current images in the Neon DB for the remaining queue are low-quality temporary local generations. You MUST regenerate 4 unique high-quality product photography images for EVERY kit tier listed in the Remaining Generation Queue in IMAGE_GEN_TASK.md using the premium AI quota. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg (overwriting the temporaries), update Neon DB kit records, commit and push after every 3-4 kits."

## DB Connection
"<HIDDEN_DATABASE_URL>"

## Completed Kits (166 unique images generated & updated in Neon DB)
- Cinco de Mayo (STARTER, PREMIUM, ULTIMATE - 12 images)
- Dia de los Muertos (STARTER, PREMIUM, ULTIMATE - 12 images)
- Graduations (STARTER, PREMIUM, ULTIMATE - 12 images)
- Fourth of July / Independence Day (STARTER, PREMIUM, ULTIMATE - 12 images)
- Holi (STARTER, PREMIUM, ULTIMATE - 12 images)
- Lunar New Year (STARTER, PREMIUM, ULTIMATE - 12 images)
- Passover (STARTER, PREMIUM, ULTIMATE - 12 images)
- Christmas (STARTER, PREMIUM, ULTIMATE - 12 images)
- Gender Reveals (STARTER, PREMIUM, ULTIMATE - 12 images)
- Weddings & Rehearsal Dinners (STARTER, PREMIUM, ULTIMATE - 12 images)
- Baby Showers (STARTER, PREMIUM - 8 images)
- Birthdays (STARTER, PREMIUM - 8 images)
- Diwali (STARTER, PREMIUM - 8 images)
- Easter (STARTER, PREMIUM - 8 images)
- St. Patrick's Day (STARTER, PREMIUM - 8 images)
- Thanksgiving (STARTER - 4 images)
- Eid (STARTER angles 1 & 2 - 2 images)

## Remaining Generation Queue (74 images total across 19 kit tiers)

### Kits in progress / needing tiers
- Eid (STARTER angles 3-4, PREMIUM angles 1-4 = 6 images)
- Engagement Parties (STARTER, PREMIUM = 8 images)
- Halloween (STARTER, PREMIUM = 8 images)
- Hanukkah (STARTER, PREMIUM = 8 images)
- New Year's (STARTER, PREMIUM = 8 images)
- Nowruz (STARTER, PREMIUM = 8 images)
- Ramadan (STARTER, PREMIUM = 8 images)
- Valentine's Day (STARTER, PREMIUM = 8 images)
- St. Patrick's Day ULTIMATE (4 images)
- Thanksgiving PREMIUM & ULTIMATE (8 images)

## Steps Per Kit
1. Generate 4 tier-appropriate images with generate_image tool
2. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg
3. UPDATE kit SET images = [...] in DB
4. git add + commit + push after every 3-4 kits
