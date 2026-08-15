BEGIN;

-- Plans (upsert by unique code)
INSERT INTO "plan" ("id", "code", "name", "description", "monthlyPrice", "yearlyPrice", "holidaysPerYear", "kitDiscount", "addOnDiscount", "isActive", "isPopular", "buttonLabel", "sortOrder", "updatedAt")
VALUES
    ('plan_starter',  'STARTER',  'Starter',  'Up to $350 retail value per kit', 49.00,  470.00, 3, 0,  10, true, false, 'Start with Starter', 0, NOW()),
    ('plan_premium',  'PREMIUM',  'Premium',  'Up to $500 retail value per kit', 79.00,  758.00, 6, 10, 20, true, true, 'Go Premium', 1, NOW()),
    ('plan_ultimate', 'ULTIMATE', 'Ultimate', 'Up to $750 retail value per kit', 119.00,  1142.00, 12, 15, 25, true, false, 'Go Ultimate', 2, NOW())
ON CONFLICT ("code") DO UPDATE SET
    "name"            = EXCLUDED."name",
    "description"     = EXCLUDED."description",
    "monthlyPrice"    = EXCLUDED."monthlyPrice",
    "yearlyPrice"     = EXCLUDED."yearlyPrice",
    "holidaysPerYear" = EXCLUDED."holidaysPerYear",
    "kitDiscount"     = EXCLUDED."kitDiscount",
    "addOnDiscount"   = EXCLUDED."addOnDiscount",
    "isActive"        = EXCLUDED."isActive",
    "isPopular"       = EXCLUDED."isPopular",
    "buttonLabel"     = EXCLUDED."buttonLabel",
    "sortOrder"       = EXCLUDED."sortOrder",
    "updatedAt"       = NOW();

-- Wipe and reinsert features per plan (cleanest way to keep them in sync on re-run)
DELETE FROM "plan_feature"
WHERE "planId" IN (
    SELECT "id" FROM "plan" WHERE "code" IN ('STARTER', 'PREMIUM', 'ULTIMATE')
);

INSERT INTO "plan_feature" ("id", "planId", "text", "sortOrder")
SELECT
    'pf_' || p."code" || '_' || f."sortOrder",
    p."id",
    f."text",
    f."sortOrder"
FROM "plan" p
JOIN (VALUES
    ('STARTER',  0, 'Curated Starter Kits'),
    ('STARTER',  1, 'Free returns & shipping'),
    ('STARTER',  2, '10% off add-ons'),
    ('STARTER',  3, 'Pause or skip anytime'),

    ('PREMIUM',  0, 'Premium Décor Kits'),
    ('PREMIUM',  1, 'Free returns & shipping'),
    ('PREMIUM',  2, '10% off kits'),
    ('PREMIUM',  3, '20% off add-ons'),
    ('PREMIUM',  4, 'Priority support'),
    ('PREMIUM',  5, 'Early access to new holidays'),

    ('ULTIMATE', 0, 'Luxury Collection Kits'),
    ('ULTIMATE', 1, 'Professional in-home setup & takedown'),
    ('ULTIMATE', 2, 'Free returns & shipping'),
    ('ULTIMATE', 3, '15% off kits'),
    ('ULTIMATE', 4, '25% off add-ons'),
    ('ULTIMATE', 5, 'Priority delivery dates'),
    ('ULTIMATE', 6, 'Exclusive limited editions')
) AS f("code", "sortOrder", "text") ON f."code" = p."code"::text;

COMMIT;
