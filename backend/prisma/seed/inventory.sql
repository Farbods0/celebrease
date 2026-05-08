-- ============================================================
-- INVENTORY SEED DATA
-- ============================================================

INSERT INTO "inventory" (
    "id",
    "totalQty",
    "availableQty",
    "reservedQty",
    "shippedQty",
    "cleaningQty",
    "repairQty",
    "lostQty",
    "itemId",
    "addOnId",
    "updatedAt"
)
VALUES

-- ============================================================
-- ITEMS
-- ============================================================

(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-led-string-warm', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-premium-ornament', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-led-candle', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-confetti-champ', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-balloon-arch', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-pastel-balloon', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-gold-star-center', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-lantern-gold', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-crescent-orn', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-rangoli-mat', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-diya-candle', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-party-hat', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-heart-ornament', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-rose-petal', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-nowruz-runner', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-hyacinth-holder', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-baby-bottle-ctr', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-pastel-egg-orn', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-bunny-figurine', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-ring-box-ctr', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-spider-web', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-pumpkin-lantern', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-menorah-candle', NULL, NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, 'item-star-david-orn', NULL, NOW()),

-- ============================================================
-- ADDONS
-- ============================================================

(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, NULL, 'addon-001', NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, NULL, 'addon-002', NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, NULL, 'addon-003', NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, NULL, 'addon-004', NOW()),
(gen_random_uuid(), 100, 100, 0, 0, 0, 0, 0, NULL, 'addon-005', NOW());