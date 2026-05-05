BEGIN;

-- Plans (upsert by unique code)
INSERT INTO "plan" ("id", "code", "name", "description", "monthlyPrice", "yearlyPrice", "holidaysPerYear", "isActive", "sortOrder", "updatedAt")
VALUES
    ('plan_starter',  'STARTER',  'Starter',  NULL, 41.00, 466.00,  3, true, 0, NOW()),
    ('plan_premium',  'PREMIUM',  'Premium',  NULL, 72.00, 864.00,  3, true, 1, NOW()),
    ('plan_ultimate', 'ULTIMATE', 'Ultimate', NULL, 99.00, 1100.00, 3, true, 2, NOW())
ON CONFLICT ("code") DO UPDATE SET
    "name"            = EXCLUDED."name",
    "description"     = EXCLUDED."description",
    "monthlyPrice"    = EXCLUDED."monthlyPrice",
    "yearlyPrice"     = EXCLUDED."yearlyPrice",
    "holidaysPerYear" = EXCLUDED."holidaysPerYear",
    "isActive"        = EXCLUDED."isActive",
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

    ('PREMIUM',  0, '3 holidays per year'),
    ('PREMIUM',  1, 'Premium Décor Kits'),
    ('PREMIUM',  2, 'Free returns & shipping'),
    ('PREMIUM',  3, '20% off add-ons'),
    ('PREMIUM',  4, 'Priority support'),
    ('PREMIUM',  5, 'Early access to new holidays'),

    ('ULTIMATE', 0, '3 holidays per year'),
    ('ULTIMATE', 1, 'Luxury Collection Kits'),
    ('ULTIMATE', 2, 'Free returns & shipping'),
    ('ULTIMATE', 3, '25% off add-ons'),
    ('ULTIMATE', 4, 'Priority delivery dates'),
    ('ULTIMATE', 5, 'Exclusive limited editions'),
    ('ULTIMATE', 6, 'Concierge support')
) AS f("code", "sortOrder", "text") ON f."code" = p."code"::text;

COMMIT;
