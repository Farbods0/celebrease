# CeleBrease Image Generation Task
**Status**: PENDING - image generation weekly quota exhausted until 2026-08-16T08:34:56 PDT
**Last Updated**: 2026-08-10 09:49 PDT

## Rule & Logic
* **Tier Differentiation**: Every tier (STARTER, PREMIUM, ULTIMATE) of every holiday must have **4 unique product photography images**.
* **STARTER Fixes**: Almost all STARTER kits were found to have duplicated placeholder images. They must ALL be regenerated, except for a few like Thanksgiving and St. Patrick's Day which were verified correct.
* **Generation Need**: 144 images total across 36 kit tiers.

## Resume Prompt (copy-paste this to restart when quota resets)
"Resume the image generation task. Generate 4 unique product photography images for every kit tier listed in the Remaining Generation Queue in IMAGE_GEN_TASK.md. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg, update Neon DB kit records, commit and push after every 3-4 kits."

## DB Connection
postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require

## Completed Kits (56 unique images generated & updated in Neon DB)
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
- Weddings STARTER (existing)

## Remaining Generation Queue (144 images total)

### Kits needing all 3 tiers (STARTER, PREMIUM, ULTIMATE = 12 images)
- Christmas
- Gender Reveals
- Weddings & Rehearsal Dinners

### Kits needing 2 tiers (STARTER, PREMIUM = 8 images)
- Baby Showers
- Birthdays
- Diwali
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
