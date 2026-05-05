INSERT INTO "kit" (
    "id", "sku", "tier", "holidayId", "status",
    "price30Day", "price60Day", "deposit",
    "seasonStart", "seasonEnd",
    "alwaysVisible", "visibleOnPdp", "addOnsEnabled", "limitInventory",
    "createdAt", "updatedAt"
) VALUES
    -- New Year's (evt-001) — seasonal Dec 15 – Jan 10
    ('kit-evt-001-s', 'NY-STARTER-2026',  'STARTER', 'evt-001', 'ACTIVE',  99.00, 149.00,  50.00, '2026-12-15', '2027-01-10', false, true, true, false, NOW(), NOW()),
    ('kit-evt-001-p', 'NY-PREMIUM-2026',  'PREMIUM', 'evt-001', 'ACTIVE', 199.00, 299.00, 100.00, '2026-12-15', '2027-01-10', false, true, true, false, NOW(), NOW()),

    -- Ramadan (evt-002) — seasonal Feb 28 – Mar 30
    ('kit-evt-002-s', 'RAM-STARTER-2026', 'STARTER', 'evt-002', 'ACTIVE',  99.00, 149.00,  50.00, '2027-02-28', '2027-03-30', false, true, true, false, NOW(), NOW()),
    ('kit-evt-002-p', 'RAM-PREMIUM-2026', 'PREMIUM', 'evt-002', 'ACTIVE', 209.00, 309.00, 100.00, '2027-02-28', '2027-03-30', false, true, true, false, NOW(), NOW()),

    -- Diwali (evt-003) — seasonal Oct 20 – Nov 15
    ('kit-evt-003-s', 'DIW-STARTER-2026', 'STARTER', 'evt-003', 'ACTIVE', 109.00, 159.00,  50.00, '2026-10-20', '2026-11-15', false, true, true, false, NOW(), NOW()),
    ('kit-evt-003-p', 'DIW-PREMIUM-2026', 'PREMIUM', 'evt-003', 'ACTIVE', 219.00, 319.00, 100.00, '2026-10-20', '2026-11-15', false, true, true, false, NOW(), NOW()),

    -- Birthdays (evt-004) — year-round (always visible, no season)
    ('kit-evt-004-s', 'BDAY-STARTER-2026', 'STARTER', 'evt-004', 'ACTIVE',  89.00, 139.00,  50.00, NULL, NULL, true, true, true, false, NOW(), NOW()),
    ('kit-evt-004-p', 'BDAY-PREMIUM-2026', 'PREMIUM', 'evt-004', 'ACTIVE', 189.00, 279.00, 100.00, NULL, NULL, true, true, true, false, NOW(), NOW()),

    -- Valentine's Day (evt-005) — seasonal Feb 1 – Feb 20
    ('kit-evt-005-s', 'VAL-STARTER-2026', 'STARTER', 'evt-005', 'ACTIVE',  99.00, 149.00,  50.00, '2027-02-01', '2027-02-20', false, true, true, false, NOW(), NOW()),
    ('kit-evt-005-p', 'VAL-PREMIUM-2026', 'PREMIUM', 'evt-005', 'ACTIVE', 199.00, 289.00, 100.00, '2027-02-01', '2027-02-20', false, true, true, false, NOW(), NOW()),

    -- Nowruz (evt-006) — seasonal Mar 15 – Apr 5
    ('kit-evt-006-s', 'NOW-STARTER-2026', 'STARTER', 'evt-006', 'ACTIVE', 109.00, 159.00,  50.00, '2027-03-15', '2027-04-05', false, true, true, false, NOW(), NOW()),
    ('kit-evt-006-p', 'NOW-PREMIUM-2026', 'PREMIUM', 'evt-006', 'ACTIVE', 219.00, 319.00, 100.00, '2027-03-15', '2027-04-05', false, true, true, false, NOW(), NOW()),

    -- Baby Showers (evt-007) — year-round
    ('kit-evt-007-s', 'BABY-STARTER-2026', 'STARTER', 'evt-007', 'ACTIVE',  89.00, 139.00,  50.00, NULL, NULL, true, true, true, false, NOW(), NOW()),
    ('kit-evt-007-p', 'BABY-PREMIUM-2026', 'PREMIUM', 'evt-007', 'ACTIVE', 179.00, 269.00, 100.00, NULL, NULL, true, true, true, false, NOW(), NOW()),

    -- Easter (evt-008) — seasonal Mar 20 – Apr 20
    ('kit-evt-008-s', 'EAS-STARTER-2026', 'STARTER', 'evt-008', 'ACTIVE',  99.00, 149.00,  50.00, '2027-03-20', '2027-04-20', false, true, true, false, NOW(), NOW()),
    ('kit-evt-008-p', 'EAS-PREMIUM-2026', 'PREMIUM', 'evt-008', 'ACTIVE', 199.00, 299.00, 100.00, '2027-03-20', '2027-04-20', false, true, true, false, NOW(), NOW()),

    -- Eid (evt-009) — seasonal Apr 1 – May 1
    ('kit-evt-009-s', 'EID-STARTER-2026', 'STARTER', 'evt-009', 'ACTIVE', 109.00, 159.00,  50.00, '2027-04-01', '2027-05-01', false, true, true, false, NOW(), NOW()),
    ('kit-evt-009-p', 'EID-PREMIUM-2026', 'PREMIUM', 'evt-009', 'ACTIVE', 219.00, 319.00, 100.00, '2027-04-01', '2027-05-01', false, true, true, false, NOW(), NOW()),

    -- Engagement Parties (evt-010) — year-round
    ('kit-evt-010-s', 'ENG-STARTER-2026', 'STARTER', 'evt-010', 'ACTIVE', 119.00, 169.00,  50.00, NULL, NULL, true, true, true, false, NOW(), NOW()),
    ('kit-evt-010-p', 'ENG-PREMIUM-2026', 'PREMIUM', 'evt-010', 'ACTIVE', 239.00, 339.00, 100.00, NULL, NULL, true, true, true, false, NOW(), NOW()),

    -- Halloween (evt-011) — seasonal Oct 1 – Nov 1
    ('kit-evt-011-s', 'HAL-STARTER-2026', 'STARTER', 'evt-011', 'ACTIVE',  99.00, 149.00,  50.00, '2026-10-01', '2026-11-01', false, true, true, false, NOW(), NOW()),
    ('kit-evt-011-p', 'HAL-PREMIUM-2026', 'PREMIUM', 'evt-011', 'ACTIVE', 199.00, 299.00, 100.00, '2026-10-01', '2026-11-01', false, true, true, false, NOW(), NOW()),

    -- Hanukkah (evt-012) — seasonal Dec 1 – Dec 30
    ('kit-evt-012-s', 'HAN-STARTER-2026', 'STARTER', 'evt-012', 'ACTIVE', 109.00, 159.00,  50.00, '2026-12-01', '2026-12-30', false, true, true, false, NOW(), NOW()),
    ('kit-evt-012-p', 'HAN-PREMIUM-2026', 'PREMIUM', 'evt-012', 'ACTIVE', 219.00, 319.00, 100.00, '2026-12-01', '2026-12-30', false, true, true, false, NOW(), NOW())
ON CONFLICT ("holidayId", "tier") DO NOTHING;
