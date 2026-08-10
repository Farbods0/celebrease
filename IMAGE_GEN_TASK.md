# CeleBrease Image Generation Task
**Status**: PENDING - image generation quota exhausted until 2026-08-09T23:43:33 PDT (11:43 PM tonight / reset in ~2h 44m)
**Last Updated**: 2026-08-09 21:00 PDT

## Rule & Logic
* **Tier Differentiation**: Every tier (STARTER, PREMIUM, ULTIMATE) of every holiday must have **4 unique product photography images**.
* **STARTER reuse**: STARTER kits with 4 existing unique AI images are kept as-is (0 generations needed for STARTER).
* **Generation Need**: 4 new images for PREMIUM + 4 new images for ULTIMATE (8 new images per holiday) across remaining tiers (~171 images remaining).

## Resume Prompt (copy-paste this to restart when quota resets)
"Resume the image generation task starting from Fourth of July / Independence Day PREMIUM (angle 1 generated, needs angles 2-4) & ULTIMATE, Holi PREMIUM & ULTIMATE, and continuing through the list. Follow the tier differentiation logic in IMAGE_GEN_TASK.md: Generate 4 unique product photography images for each PREMIUM and ULTIMATE tier, leaving STARTER kits intact. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg, update Neon DB kit records, commit and push after every 3-4 kits."

## DB Connection
postgresql://neondb_owner:npg_CXvGP5goSRV8@ep-tiny-tooth-aqpsu11q-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require

## Completed Kits (24 unique images generated & updated in Neon DB)
- Cinco de Mayo STARTER (existing)
- Cinco de Mayo PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Cinco de Mayo ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Dia de los Muertos STARTER (existing)
- Dia de los Muertos PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Dia de los Muertos ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Graduations STARTER (existing)
- Graduations PREMIUM (COMPLETED - 4 new images generated & updated in DB)
- Graduations ULTIMATE (COMPLETED - 4 new images generated & updated in DB)
- Holi STARTER (existing)
- Lunar New Year STARTER (existing)
- Passover STARTER (existing)
- St. Patricks Day STARTER (existing, slug: st-patricks-day)
- Thanksgiving STARTER (existing)
- Independence Day STARTER (existing)
- Weddings STARTER (existing)

## Remaining Generation Queue (~171 images total)

### 3-Tier Holidays (Needs 4 PREMIUM + 4 ULTIMATE images each)
- Fourth of July / Independence Day PREMIUM (angle 1 generated, needs angles 2-4) & ULTIMATE
- Holi PREMIUM & ULTIMATE
- Lunar New Year PREMIUM & ULTIMATE
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
