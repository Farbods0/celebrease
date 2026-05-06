-- ============================================================
-- SEED: Items
-- ============================================================
INSERT INTO item (
  id, sku, name, image, description, category,
  "vendorName", "vendorEmail", "vendorPhone",
  "costPerUnit", "totalQty", "lowStockThreshold",
  "initialStatus", status, "createdAt", "updatedAt"
) VALUES

-- ── Universal / Multi-holiday ──────────────────────────────
('item-led-string-warm',  'LED-STRING-WARM',  'LED String Lights – Warm White',
 '/uploads/inventory/1777963542006-641340743.png',
 'Warm white LED string lights, 10 m, 100 micro-LEDs. Battery-operated.',
 'Lighting',
 'Bright Decor Co.', 'orders@brightdecor.com', '(555) 100-0001',
 8.50, 500, 50, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-premium-ornament', 'ORN-PREM-SET',    'Premium Ornament Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 12 shatterproof ornaments in assorted metallic finishes.',
 'Ornaments',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0002',
 12.00, 400, 40, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-led-candle',       'LED-CANDLE-SET',  'LED Candle Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 3 flameless LED pillar candles with timer function.',
 'Lighting',
 'GlowCraft', 'orders@glowcraft.com', '(555) 100-0003',
 10.00, 350, 35, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-confetti-champ',   'CONF-CHAMP',      'Champagne Glitter Confetti',
 '/uploads/inventory/1777963542006-641340743.png',
 'Biodegradable champagne-colored glitter confetti, 200 g bag.',
 'Accents',
 'Party Sparkle', 'info@partysparkle.com', '(555) 100-0004',
 3.50, 600, 60, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-balloon-arch',     'BALLOON-ARCH',    'Balloon Arch Kit',
 '/uploads/inventory/1777963542006-641340743.png',
 'DIY balloon arch with 120 balloons in mixed sizes and a flexible frame.',
 'Accents',
 'Party Sparkle', 'info@partysparkle.com', '(555) 100-0005',
 9.00, 300, 30, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-pastel-balloon',   'BALLOON-PASTEL',  'Pastel Balloon Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Pack of 50 pastel-colored latex balloons, assorted shades.',
 'Accents',
 'Party Sparkle', 'info@partysparkle.com', '(555) 100-0006',
 4.00, 450, 45, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── New Year's ─────────────────────────────────────────────
('item-gold-star-center', 'CTR-GOLD-STAR',   'Gold Star Centerpiece',
 '/uploads/inventory/1777963542006-641340743.png',
 'Metallic gold star centerpiece, 30 cm tall. Perfect for table settings.',
 'Tabletop Décor',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0007',
 7.50, 250, 25, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Ramadan / Eid ──────────────────────────────────────────
('item-lantern-gold',     'LANT-GOLD-SET',   'Lantern Set – Gold',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 3 gold-finish metal lanterns in small, medium, and large.',
 'Lighting',
 'Luxe Lanterns', 'orders@luxelanterns.com', '(555) 100-0008',
 15.00, 200, 20, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-crescent-orn',     'ORN-CRESCENT',    'Crescent Moon Ornament',
 '/uploads/inventory/1777963542006-641340743.png',
 'Elegant crescent moon ornament with gold-foil detail, 15 cm.',
 'Ornaments',
 'Luxe Lanterns', 'orders@luxelanterns.com', '(555) 100-0009',
 6.00, 300, 30, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Diwali ─────────────────────────────────────────────────
('item-rangoli-mat',      'RANG-MAT-SET',    'Rangoli Mat Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 4 vibrant rangoli floor mats, each 30 cm diameter.',
 'Tabletop Décor',
 'Festival Fabrics', 'contact@festivalfabrics.com', '(555) 100-0010',
 9.00, 280, 28, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-diya-candle',      'DIYA-CANDLE-SET', 'Diya Candle Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 8 traditional clay diyas with colorful paint and tea lights.',
 'Lighting',
 'Festival Fabrics', 'contact@festivalfabrics.com', '(555) 100-0011',
 7.00, 320, 32, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Birthdays ──────────────────────────────────────────────
('item-party-hat',        'HAT-PARTY-SET',   'Party Hat Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Pack of 8 celebratory party hats with elastic chin straps.',
 'Tabletop Décor',
 'Party Sparkle', 'info@partysparkle.com', '(555) 100-0012',
 5.00, 400, 40, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Valentine's Day ────────────────────────────────────────
('item-heart-ornament',   'ORN-HEART-SET',   'Heart Ornament Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 6 velvet-textured heart ornaments in red and pink.',
 'Ornaments',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0013',
 8.00, 260, 26, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-rose-petal',       'PETAL-ROSE',      'Rose Petal Scatter',
 '/uploads/inventory/1777963542006-641340743.png',
 'Pack of 200 faux rose petals in deep red, perfect for table scattering.',
 'Accents',
 'Bloom Decor', 'hello@bloomdecor.com', '(555) 100-0014',
 4.50, 500, 50, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Nowruz ─────────────────────────────────────────────────
('item-nowruz-runner',    'RUNR-NOWRUZ',     'Nowruz Table Runner',
 '/uploads/inventory/1777963542006-641340743.png',
 'Embroidered table runner with traditional Nowruz motifs, 180 × 30 cm.',
 'Tabletop Décor',
 'Festival Fabrics', 'contact@festivalfabrics.com', '(555) 100-0015',
 11.00, 180, 18, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-hyacinth-holder',  'HOLD-HYACINTH',   'Hyacinth Candle Holder',
 '/uploads/inventory/1777963542006-641340743.png',
 'Ceramic candle holder inspired by hyacinth motifs, fits standard tea-lights.',
 'Tabletop Décor',
 'GlowCraft', 'orders@glowcraft.com', '(555) 100-0016',
 8.00, 220, 22, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Baby Showers ───────────────────────────────────────────
('item-baby-bottle-ctr',  'CTR-BABY-BOTTLE', 'Baby Bottle Centerpiece',
 '/uploads/inventory/1777963542006-641340743.png',
 'Adorable baby bottle-shaped centerpiece, 25 cm, pastel finish.',
 'Tabletop Décor',
 'Little Celebrations', 'orders@littlecelebrations.com', '(555) 100-0017',
 9.50, 200, 20, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Easter ─────────────────────────────────────────────────
('item-pastel-egg-orn',   'ORN-PASTEL-EGG',  'Pastel Egg Ornaments',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 8 pastel egg ornaments with satin ribbon hangers.',
 'Ornaments',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0018',
 7.00, 300, 30, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-bunny-figurine',   'FIG-BUNNY-SET',   'Bunny Figurine Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 3 ceramic bunny figurines in white, pink, and lavender.',
 'Tabletop Décor',
 'Little Celebrations', 'orders@littlecelebrations.com', '(555) 100-0019',
 10.00, 180, 18, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Engagement Parties ─────────────────────────────────────
('item-ring-box-ctr',     'CTR-RING-BOX',    'Ring Box Centerpiece',
 '/uploads/inventory/1777963542006-641340743.png',
 'Elegant ring-box centerpiece with velvet lining, 20 cm.',
 'Tabletop Décor',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0020',
 11.00, 160, 16, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Halloween ──────────────────────────────────────────────
('item-spider-web',       'KIT-SPIDER-WEB',  'Spider Web Kit',
 '/uploads/inventory/1777963542006-641340743.png',
 'Stretchable spider web decoration with 6 plastic spiders, covers 4 m².',
 'Accents',
 'Spooky Supply', 'orders@spookysupply.com', '(555) 100-0021',
 5.50, 350, 35, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-pumpkin-lantern',  'LANT-PUMPKIN',    'Pumpkin Lantern Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 3 LED pumpkin lanterns with flickering effect, assorted sizes.',
 'Lighting',
 'Spooky Supply', 'orders@spookysupply.com', '(555) 100-0022',
 12.00, 250, 25, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

-- ── Hanukkah ───────────────────────────────────────────────
('item-menorah-candle',   'MENORAH-CANDLE',  'Menorah Candle Set',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 44 hand-dipped menorah candles in blue and white.',
 'Lighting',
 'GlowCraft', 'orders@glowcraft.com', '(555) 100-0023',
 6.50, 280, 28, 'ACTIVE', 'ACTIVE', NOW(), NOW()),

('item-star-david-orn',   'ORN-STAR-DAVID',  'Star of David Ornament',
 '/uploads/inventory/1777963542006-641340743.png',
 'Set of 4 blue and silver Star of David ornaments, 10 cm each.',
 'Ornaments',
 'Ornate House', 'sales@ornatehouse.com', '(555) 100-0024',
 7.50, 240, 24, 'ACTIVE', 'ACTIVE', NOW(), NOW());


-- ============================================================
-- SEED: Kit ↔ Item mappings
-- Starter kits: 2-3 items   |   Premium kits: 4-5 items
-- Kit IDs are resolved at INSERT time via subquery on SKU.
-- ============================================================
INSERT INTO kit_item ("kitId", "itemId", qty)

-- ── New Year's Starter ─────────────────────────────────────
SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-001-s'
UNION ALL SELECT k.id, 'item-confetti-champ',  2 FROM kit k WHERE k.id = 'kit-evt-001-s'
UNION ALL SELECT k.id, 'item-gold-star-center', 1 FROM kit k WHERE k.id = 'kit-evt-001-s'

-- ── New Year's Premium ─────────────────────────────────────
UNION ALL SELECT k.id, 'item-led-string-warm',  2 FROM kit k WHERE k.id = 'kit-evt-001-p'
UNION ALL SELECT k.id, 'item-confetti-champ',   3 FROM kit k WHERE k.id = 'kit-evt-001-p'
UNION ALL SELECT k.id, 'item-gold-star-center', 2 FROM kit k WHERE k.id = 'kit-evt-001-p'
UNION ALL SELECT k.id, 'item-premium-ornament', 1 FROM kit k WHERE k.id = 'kit-evt-001-p'
UNION ALL SELECT k.id, 'item-led-candle',       1 FROM kit k WHERE k.id = 'kit-evt-001-p'

-- ── Ramadan Starter ────────────────────────────────────────
UNION ALL SELECT k.id, 'item-lantern-gold',   1 FROM kit k WHERE k.id = 'kit-evt-002-s'
UNION ALL SELECT k.id, 'item-crescent-orn',   2 FROM kit k WHERE k.id = 'kit-evt-002-s'

-- ── Ramadan Premium ────────────────────────────────────────
UNION ALL SELECT k.id, 'item-lantern-gold',     2 FROM kit k WHERE k.id = 'kit-evt-002-p'
UNION ALL SELECT k.id, 'item-crescent-orn',     3 FROM kit k WHERE k.id = 'kit-evt-002-p'
UNION ALL SELECT k.id, 'item-led-candle',       2 FROM kit k WHERE k.id = 'kit-evt-002-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-002-p'

-- ── Diwali Starter ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-rangoli-mat',   1 FROM kit k WHERE k.id = 'kit-evt-003-s'
UNION ALL SELECT k.id, 'item-diya-candle',   2 FROM kit k WHERE k.id = 'kit-evt-003-s'

-- ── Diwali Premium ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-rangoli-mat',     2 FROM kit k WHERE k.id = 'kit-evt-003-p'
UNION ALL SELECT k.id, 'item-diya-candle',     4 FROM kit k WHERE k.id = 'kit-evt-003-p'
UNION ALL SELECT k.id, 'item-lantern-gold',    1 FROM kit k WHERE k.id = 'kit-evt-003-p'
UNION ALL SELECT k.id, 'item-led-string-warm', 1 FROM kit k WHERE k.id = 'kit-evt-003-p'

-- ── Birthdays Starter ──────────────────────────────────────
UNION ALL SELECT k.id, 'item-balloon-arch', 1 FROM kit k WHERE k.id = 'kit-evt-004-s'
UNION ALL SELECT k.id, 'item-party-hat',   1 FROM kit k WHERE k.id = 'kit-evt-004-s'

-- ── Birthdays Premium ──────────────────────────────────────
UNION ALL SELECT k.id, 'item-balloon-arch',    1 FROM kit k WHERE k.id = 'kit-evt-004-p'
UNION ALL SELECT k.id, 'item-party-hat',       2 FROM kit k WHERE k.id = 'kit-evt-004-p'
UNION ALL SELECT k.id, 'item-confetti-champ',  2 FROM kit k WHERE k.id = 'kit-evt-004-p'
UNION ALL SELECT k.id, 'item-led-string-warm', 1 FROM kit k WHERE k.id = 'kit-evt-004-p'

-- ── Valentine's Day Starter ────────────────────────────────
UNION ALL SELECT k.id, 'item-heart-ornament', 1 FROM kit k WHERE k.id = 'kit-evt-005-s'
UNION ALL SELECT k.id, 'item-rose-petal',     2 FROM kit k WHERE k.id = 'kit-evt-005-s'

-- ── Valentine's Day Premium ────────────────────────────────
UNION ALL SELECT k.id, 'item-heart-ornament',  2 FROM kit k WHERE k.id = 'kit-evt-005-p'
UNION ALL SELECT k.id, 'item-rose-petal',      3 FROM kit k WHERE k.id = 'kit-evt-005-p'
UNION ALL SELECT k.id, 'item-led-candle',      1 FROM kit k WHERE k.id = 'kit-evt-005-p'
UNION ALL SELECT k.id, 'item-led-string-warm', 1 FROM kit k WHERE k.id = 'kit-evt-005-p'

-- ── Nowruz Starter ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-nowruz-runner',   1 FROM kit k WHERE k.id = 'kit-evt-006-s'
UNION ALL SELECT k.id, 'item-hyacinth-holder', 2 FROM kit k WHERE k.id = 'kit-evt-006-s'

-- ── Nowruz Premium ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-nowruz-runner',   1 FROM kit k WHERE k.id = 'kit-evt-006-p'
UNION ALL SELECT k.id, 'item-hyacinth-holder', 3 FROM kit k WHERE k.id = 'kit-evt-006-p'
UNION ALL SELECT k.id, 'item-led-candle',      2 FROM kit k WHERE k.id = 'kit-evt-006-p'
UNION ALL SELECT k.id, 'item-led-string-warm', 1 FROM kit k WHERE k.id = 'kit-evt-006-p'

-- ── Baby Showers Starter ───────────────────────────────────
UNION ALL SELECT k.id, 'item-baby-bottle-ctr', 1 FROM kit k WHERE k.id = 'kit-evt-007-s'
UNION ALL SELECT k.id, 'item-pastel-balloon',  1 FROM kit k WHERE k.id = 'kit-evt-007-s'

-- ── Baby Showers Premium ───────────────────────────────────
UNION ALL SELECT k.id, 'item-baby-bottle-ctr',  2 FROM kit k WHERE k.id = 'kit-evt-007-p'
UNION ALL SELECT k.id, 'item-pastel-balloon',   2 FROM kit k WHERE k.id = 'kit-evt-007-p'
UNION ALL SELECT k.id, 'item-balloon-arch',     1 FROM kit k WHERE k.id = 'kit-evt-007-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-007-p'

-- ── Easter Starter ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-pastel-egg-orn',  1 FROM kit k WHERE k.id = 'kit-evt-008-s'
UNION ALL SELECT k.id, 'item-bunny-figurine',  1 FROM kit k WHERE k.id = 'kit-evt-008-s'

-- ── Easter Premium ─────────────────────────────────────────
UNION ALL SELECT k.id, 'item-pastel-egg-orn',   2 FROM kit k WHERE k.id = 'kit-evt-008-p'
UNION ALL SELECT k.id, 'item-bunny-figurine',   1 FROM kit k WHERE k.id = 'kit-evt-008-p'
UNION ALL SELECT k.id, 'item-pastel-balloon',   1 FROM kit k WHERE k.id = 'kit-evt-008-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-008-p'

-- ── Eid Starter ────────────────────────────────────────────
UNION ALL SELECT k.id, 'item-lantern-gold', 1 FROM kit k WHERE k.id = 'kit-evt-009-s'
UNION ALL SELECT k.id, 'item-led-candle',   1 FROM kit k WHERE k.id = 'kit-evt-009-s'

-- ── Eid Premium ────────────────────────────────────────────
UNION ALL SELECT k.id, 'item-lantern-gold',     2 FROM kit k WHERE k.id = 'kit-evt-009-p'
UNION ALL SELECT k.id, 'item-led-candle',       2 FROM kit k WHERE k.id = 'kit-evt-009-p'
UNION ALL SELECT k.id, 'item-crescent-orn',     2 FROM kit k WHERE k.id = 'kit-evt-009-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-009-p'
UNION ALL SELECT k.id, 'item-premium-ornament', 1 FROM kit k WHERE k.id = 'kit-evt-009-p'

-- ── Engagement Parties Starter ─────────────────────────────
UNION ALL SELECT k.id, 'item-ring-box-ctr',    1 FROM kit k WHERE k.id = 'kit-evt-010-s'
UNION ALL SELECT k.id, 'item-confetti-champ',  1 FROM kit k WHERE k.id = 'kit-evt-010-s'

-- ── Engagement Parties Premium ─────────────────────────────
UNION ALL SELECT k.id, 'item-ring-box-ctr',    1 FROM kit k WHERE k.id = 'kit-evt-010-p'
UNION ALL SELECT k.id, 'item-confetti-champ',  2 FROM kit k WHERE k.id = 'kit-evt-010-p'
UNION ALL SELECT k.id, 'item-led-candle',      1 FROM kit k WHERE k.id = 'kit-evt-010-p'
UNION ALL SELECT k.id, 'item-led-string-warm', 1 FROM kit k WHERE k.id = 'kit-evt-010-p'

-- ── Halloween Starter ──────────────────────────────────────
UNION ALL SELECT k.id, 'item-spider-web',      1 FROM kit k WHERE k.id = 'kit-evt-011-s'
UNION ALL SELECT k.id, 'item-pumpkin-lantern', 1 FROM kit k WHERE k.id = 'kit-evt-011-s'

-- ── Halloween Premium ──────────────────────────────────────
UNION ALL SELECT k.id, 'item-spider-web',       2 FROM kit k WHERE k.id = 'kit-evt-011-p'
UNION ALL SELECT k.id, 'item-pumpkin-lantern',  2 FROM kit k WHERE k.id = 'kit-evt-011-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-011-p'
UNION ALL SELECT k.id, 'item-led-candle',       1 FROM kit k WHERE k.id = 'kit-evt-011-p'

-- ── Hanukkah Starter ───────────────────────────────────────
UNION ALL SELECT k.id, 'item-menorah-candle',  1 FROM kit k WHERE k.id = 'kit-evt-012-s'
UNION ALL SELECT k.id, 'item-star-david-orn',  1 FROM kit k WHERE k.id = 'kit-evt-012-s'

-- ── Hanukkah Premium ───────────────────────────────────────
UNION ALL SELECT k.id, 'item-menorah-candle',   1 FROM kit k WHERE k.id = 'kit-evt-012-p'
UNION ALL SELECT k.id, 'item-star-david-orn',   2 FROM kit k WHERE k.id = 'kit-evt-012-p'
UNION ALL SELECT k.id, 'item-premium-ornament', 1 FROM kit k WHERE k.id = 'kit-evt-012-p'
UNION ALL SELECT k.id, 'item-led-string-warm',  1 FROM kit k WHERE k.id = 'kit-evt-012-p';