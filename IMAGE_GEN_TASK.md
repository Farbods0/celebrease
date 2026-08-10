# CeleBrease Image Generation Task
**Status**: PENDING - image generation weekly quota exhausted until 2026-08-16T08:34:56 PDT
**Last Updated**: 2026-08-10 09:49 PDT

## Rule & Logic
* **Tier Differentiation**: Every tier (STARTER, PREMIUM, ULTIMATE) of every holiday must have **4 unique product photography images**.
* **STARTER reuse**: STARTER kits with 4 existing unique AI images are kept as-is (0 generations needed for STARTER).
* **Generation Need**: 4 new images for PREMIUM + 4 new images for ULTIMATE (8 new images per holiday) across remaining tiers (~140 images remaining).

## Resume Prompt (copy-paste this to restart when quota resets)
"Resume the image generation task starting from St. Patrick's Day ULTIMATE (needs angles 1-4) and continuing through Thanksgiving PREMIUM & ULTIMATE, Weddings PREMIUM & ULTIMATE, Christmas PREMIUM & ULTIMATE, and the rest of the queue. Follow the tier differentiation logic in IMAGE_GEN_TASK.md: Generate 4 unique product photography images for each PREMIUM and ULTIMATE tier, leaving STARTER kits intact. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg, update Neon DB kit records, commit and push after every 3-4 kits."

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

## Remaining Generation Queue (~140 images total)

### 3-Tier Holidays (Needs 4 PREMIUM + 4 ULTIMATE images each)
- St. Patricks Day ULTIMATE
- Thanksgiving PREMIUM & ULTIMATE
- Passover PREMIUM & ULTIMATE
- St. Patricks Day PREMIUM & ULTIMATE
- Thanksgiving PREMIUM & ULTIMATE
- Weddings & Rehearsal Dinners PREMIUM & ULTIMATE
- Christmas PREMIUM & ULTIMATE

### 2-Tier & Special Holidays (Needs 4 images per un-generated tier = 107 images)
- Gender Reveals STARTER (angles 2-4), PREMIUM, ULTIMATE
- New Year's STARTER & PREMIUM
- Ramadan STARTER & PREMIUM
- Birthdays STARTER & PREMIUM
- Valentine's Day STARTER & PREMIUM
- Halloween STARTER & PREMIUM
- Baby Showers STARTER & PREMIUM
- Diwali STARTER & PREMIUM
- Easter STARTER & PREMIUM
- Eid STARTER & PREMIUM
- Engagement Parties STARTER & PREMIUM
- Hanukkah STARTER & PREMIUM
- Nowruz STARTER & PREMIUM

## Steps Per Kit
1. Generate 4 tier-appropriate images with generate_image tool
2. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg
3. UPDATE kit SET images = [...] in DB
4. git add + commit + push after every 3-4 kits
