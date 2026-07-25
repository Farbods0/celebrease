BEGIN;

-- Plans (upsert by unique code)
INSERT INTO "plan" ("id", "code", "name", "description", "monthlyPrice", "yearlyPrice", "holidaysPerYear", "kitDiscount", "addOnDiscount", "isActive", "isPopular", "buttonLabel", "sortOrder", "updatedAt")
VALUES
    ('plan_starter',  'STARTER',  'Starter',  'Up to $350/yr equivalent retail value', 49.00,  470.00, 3, 0,  10, true, false, 'Start with Starter', 0, NOW()),
    ('plan_premium',  'PREMIUM',  'Premium',  'Up to $750/yr equivalent retail value', 79.00,  758.00, 5, 10, 20, true, true, 'Go Premium', 1, NOW()),
    ('plan_ultimate', 'ULTIMATE', 'Ultimate', 'Up to $1,500/yr equivalent retail value', 119.00,  1142.00, 8, 15, 25, true, false, 'Go Ultimate', 2, NOW())
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
    ('STARTER',  0, '3 holidays per year'),
    ('STARTER',  1, 'Curated Starter Kits'),
    ('STARTER',  2, 'Free returns & shipping'),
    ('STARTER',  3, '10% off add-ons'),
    ('STARTER',  4, 'Pause or skip anytime'),

    ('PREMIUM',  0, '5 holidays per year'),
    ('PREMIUM',  1, 'Premium Décor Kits'),
    ('PREMIUM',  2, 'Free returns & shipping'),
    ('PREMIUM',  3, '10% off kits'),
    ('PREMIUM',  4, '20% off add-ons'),
    ('PREMIUM',  5, 'Priority support'),
    ('PREMIUM',  6, 'Early access to new holidays'),

    ('ULTIMATE', 0, '8 holidays per year'),
    ('ULTIMATE', 1, 'Luxury Collection Kits'),
    ('ULTIMATE', 2, 'Free returns & shipping'),
    ('ULTIMATE', 3, '15% off kits'),
    ('ULTIMATE', 4, '25% off add-ons'),
    ('ULTIMATE', 5, 'Priority delivery dates'),
    ('ULTIMATE', 6, 'Exclusive limited editions'),
    ('ULTIMATE', 7, 'Concierge support')
) AS f("code", "sortOrder", "text") ON f."code" = p."code"::text;

COMMIT;
