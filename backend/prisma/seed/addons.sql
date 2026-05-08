INSERT INTO "addon"
("id", "name", "image", "price", "deposit", "inventory", "isActive", "createdAt", "updatedAt")
VALUES
    ('addon-001', 'Christmas Tree (6ft)',    '/uploads/addons/christmas-tree.png',    59.00, 100.00,  42, true, NOW(), NOW()),
    ('addon-002', 'Extra Lights Kit',        '/uploads/addons/extra-lights-kit.png',  12.00,   0.00, 110, true, NOW(), NOW()),
    ('addon-003', 'Metallic Table Runner',   '/uploads/addons/metallic-runner.png',    8.00,   0.00,  34, true, NOW(), NOW()),
    ('addon-004', 'Balloon Arch Deluxe',     '/uploads/addons/balloon-arch.png',      29.00,   0.00,  76, true, NOW(), NOW()),
    ('addon-005', 'Wreath (Premium Floral)', '/uploads/addons/wreath-floral.png',     19.00,  25.00,  20, false, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Insert seed data into "addon_holiday"
INSERT INTO "addon_holiday" ("addOnId", "holidayId")
VALUES
    -- Christmas Tree (6ft)  →  Hanukkah  (no "Christmas" in holiday seed)
    ('addon-001', 'evt-012'),

    -- Extra Lights Kit  →  Halloween, Hanukkah (≈ Christmas), Diwali (festival of lights)
    ('addon-002', 'evt-011'),
    ('addon-002', 'evt-012'),
    ('addon-002', 'evt-003'),

    -- Metallic Table Runner  →  New Year's, Valentine's Day
    ('addon-003', 'evt-001'),
    ('addon-003', 'evt-005'),

    -- Balloon Arch Deluxe  →  Birthdays, Baby Showers
    ('addon-004', 'evt-004'),
    ('addon-004', 'evt-007'),

    -- Wreath (Premium Floral)  →  Easter  (no "Thanksgiving" in holiday seed)
    ('addon-005', 'evt-008')
ON CONFLICT ("addOnId", "holidayId") DO NOTHING;