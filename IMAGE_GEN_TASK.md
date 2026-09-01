# CeleBrease Image Generation Task
**Status**: PENDING (Regenerating exact duplicate images)

## Remaining Generation Queue (24 images)
- [ ] **Día de los Muertos Starter Kit** (4 angles)
- [ ] **Día de los Muertos Premium Kit** (4 angles)
- [ ] **Día de los Muertos Ultimate Kit** (4 angles)
- [ ] **Fourth of July Starter Kit** (4 angles)
- [ ] **Fourth of July Premium Kit** (4 angles)
- [ ] **Fourth of July Ultimate Kit** (4 angles)

## Steps Per Kit
1. Generate 4 tier-appropriate images with generate_image tool
2. Save to frontend/public/uploads/holidays/{slug}-{tier}-angle{n}.jpg
3. UPDATE kit SET images = [...] in DB
4. git add + commit + push after every 3-4 kits
