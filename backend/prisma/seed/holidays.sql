-- Insert seed data into "holiday"

INSERT INTO "holiday"
("id", "name", "image", "category", "description", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
-- 1
('evt-001', 'New Year''s', '/uploads/holidays/new-years.png', 'TRADITIONAL',
 'Ring in the new year with festive decorations and elegant touches.', 1, true, NOW(), NOW()),

-- 2
('evt-002', 'Ramadan', '/uploads/holidays/ramadan.png', 'CULTURAL',
 'Foster a calm and lovely space for reflection and celebration.', 2, true, NOW(), NOW()),

-- 3
('evt-003', 'Diwali', '/uploads/holidays/diwali.png', 'CULTURAL',
 'Illuminate your space with traditional diyas and vibrant decorations.', 3, true, NOW(), NOW()),

-- 4
('evt-004', 'Birthdays', '/uploads/holidays/birthdays.png', 'EVENT_BASED',
 'Make every birthday celebration special with themed decorations.', 4, true, NOW(), NOW()),

-- 5
('evt-005', 'Valentine''s Day', '/uploads/holidays/valentines-day.png', 'TRADITIONAL',
 'Set the mood for romance with elegant and heartfelt decorations.', 5, true, NOW(), NOW()),

-- 6
('evt-006', 'Nowruz', '/uploads/holidays/nowruz.png', 'CULTURAL',
 'Celebrate Persian New Year with traditional Haft-Seen setup and décor.', 6, true, NOW(), NOW()),

-- 7
('evt-007', 'Baby Showers', '/uploads/holidays/baby-showers.png', 'EVENT_BASED',
 'Welcome the little one with adorable and charming decorations.', 7, true, NOW(), NOW()),

-- 8
('evt-008', 'Easter', '/uploads/holidays/easter.png', 'TRADITIONAL',
 'Brighten your home with spring-inspired and festive Easter décor.', 8, true, NOW(), NOW()),

-- 9
('evt-009', 'Eid', '/uploads/holidays/eid.png', 'CULTURAL',
 'Celebrate with joy using elegant banners and festive decorations.', 9, true, NOW(), NOW()),

-- 10
('evt-010', 'Engagement Parties', '/uploads/holidays/engagement-parties.png', 'EVENT_BASED',
 'Mark the special moment with sophisticated and romantic décor.', 10, true, NOW(), NOW()),

-- 11
('evt-011', 'Halloween', '/uploads/holidays/halloween.png', 'TRADITIONAL',
 'Transform your space into a spooky wonderland with props and lighting.', 11, true, NOW(), NOW()),

-- 12
('evt-012', 'Hanukkah', '/uploads/holidays/hanukkah.png', 'CULTURAL',
 'Celebrate the Festival of Lights with traditional and elegant décor.', 12, true, NOW(), NOW());