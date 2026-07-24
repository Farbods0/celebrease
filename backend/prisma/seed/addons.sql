INSERT INTO "addon"
("id", "name", "image", "description", "price", "deposit", "isActive", "createdAt", "updatedAt")
VALUES
    ('addon-001', 'Christmas Tree (6ft)',    '/uploads/addons/christmas-tree.png',    'A lush 6-foot pre-lit artificial tree with warm-white lights, ready to anchor your holiday display.',                                  59.00, 100.00, true,  NOW(), NOW()),
    ('addon-002', 'Extra Lights Kit',        '/uploads/addons/extra-lights-kit.png',  'An extra set of warm-white string lights (2 × 50 ft) to layer over any kit for added sparkle.',                                        12.00,   0.00, true,  NOW(), NOW()),
    ('addon-003', 'Metallic Table Runner',   '/uploads/addons/metallic-runner.png',   'A premium metallic runner that adds instant shimmer to dining and dessert tables.',                                                    8.00,   0.00, true,  NOW(), NOW()),
    ('addon-004', 'Balloon Arch Deluxe',     '/uploads/addons/balloon-arch.png',      'A show-stopping arch of 60+ balloons in your event''s colors — pre-assembled and ready to frame any entrance, dessert table, or photo backdrop.', 29.00, 0.00, true,  NOW(), NOW()),
    ('addon-005', 'Wreath (Premium Floral)', '/uploads/addons/wreath-floral.png',     'A handcrafted premium floral wreath that brings a fresh, designer finish to doors, mantels, and walls.',                               19.00,  25.00, false, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
    "description" = EXCLUDED."description",
    "image"       = EXCLUDED."image";

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