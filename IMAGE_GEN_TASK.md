# CeleBrease Image Generation Task
**Status**: PENDING - (Interim Local Gen Applied) - image generation quota exhausted again until ~2026-08-23 15:34 UTC (08:34 AM PDT)
**Last Updated**: 2026-08-17 09:35 PDT

## Rule & Logic
* **Tier Differentiation**: Every tier (STARTER, PREMIUM, ULTIMATE) of every holiday must have **4 unique product photography images**.
* **STARTER Fixes**: Almost all STARTER kits were found to have duplicated placeholder images. They must ALL be regenerated, except for a few like Thanksgiving and St. Patrick's Day which were verified correct.
* **Generation Need**: 144 images total across 36 kit tiers.

## Resume Prompt (copy-paste this to restart when quota resets)
"Resume the image generation task. The current images in the Neon DB for the remaining queue are low-quality temporary local generations. You MUST regenerate 4 unique high-quality product photography images for EVERY kit tier listed in the Remaining Generation Queue in IMAGE_GEN_TASK.md using the premium AI quota. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg (overwriting the temporaries), update Neon DB kit records, commit and push after every 3-4 kits."

## DB Connection
"<HIDDEN_DATABASE_URL>"

## Completed Kits (116 unique images generated & updated in Neon DB)
- Cinco de Mayo STARTER (existing)
- Cinco de Mayo PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Cinco de Mayo ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Dia de los Muertos STARTER (existing)
- Dia de los Muertos PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Dia de los Muertos ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Graduations STARTER (existing)
- Graduations PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Graduations ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Fourth of July / Independence Day PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Fourth of July / Independence Day ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Holi STARTER (existing)
- Holi PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Holi ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Lunar New Year STARTER (existing)
- Lunar New Year PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Lunar New Year ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Passover STARTER (existing)
- Passover PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Passover ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- St. Patricks Day STARTER (existing, slug: st-patricks-day)
- St. Patricks Day PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Thanksgiving STARTER (existing)
- Independence Day STARTER (existing)
- Christmas STARTER (COMPLETED - 4 new images generated & updated in DB)
- Christmas PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Christmas ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Gender Reveals STARTER (COMPLETED - 4 new images generated & updated in DB)
- Gender Reveals PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Gender Reveals ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Weddings & Rehearsal Dinners STARTER (COMPLETED - 4 new images generated & updated in DB)
- Weddings & Rehearsal Dinners PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Weddings & Rehearsal Dinners ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Baby Showers STARTER (COMPLETED - 4 new images generated & updated in DB)
- Baby Showers PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Birthdays STARTER (COMPLETED - 4 new images generated & updated in DB)
- Birthdays PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Diwali STARTER (COMPLETED - 4 new images generated & updated in DB)
- Diwali PREMIUM (COMPLETED - 4 new images generated & updated in DB)

## Remaining Generation Queue (72 images total)

### Kits needing 2 tiers (STARTER, PREMIUM = 8 images)
- Easter
- Eid
- Engagement Parties
- Halloween
- Hanukkah
- New Year's
- Nowruz
- Ramadan
- Valentine's Day

### Kits needing specific tiers (4 images per tier)
- St. Patrick's Day ULTIMATE
- Thanksgiving PREMIUM & ULTIMATE

## Steps Per Kit
1. Generate 4 tier-appropriate images with generate_image tool
2. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg
3. UPDATE kit SET images = [...] in DB
4. git add + commit + push after every 3-4 kits
