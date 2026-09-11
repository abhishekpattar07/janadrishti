-- ============================================
-- JanaDrishti Seed Data
-- Vijayapura City Corporation
-- ============================================

-- ============================================
-- DEPARTMENTS
-- ============================================

INSERT INTO departments (id, name, name_kn, slug, contact_phone) VALUES
    ('d1000000-0000-0000-0000-000000000001', 'Roads & Infrastructure', 'ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ', 'roads', '08352-278540'),
    ('d1000000-0000-0000-0000-000000000002', 'Sanitation & Waste Management', 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ', 'sanitation', '08352-278541'),
    ('d1000000-0000-0000-0000-000000000003', 'Street Lights & Electrical', 'ಬೀದಿ ದೀಪ ಮತ್ತು ವಿದ್ಯುತ್', 'streetlights', '08352-278542'),
    ('d1000000-0000-0000-0000-000000000004', 'Drainage & Sewerage', 'ಚರಂಡಿ ಮತ್ತು ಒಳಚರಂಡಿ', 'drainage', '08352-278543'),
    ('d1000000-0000-0000-0000-000000000005', 'Water Supply', 'ನೀರು ಸರಬರಾಜು', 'water', '08352-278544'),
    ('d1000000-0000-0000-0000-000000000006', 'Parks & Public Spaces', 'ಉದ್ಯಾನವನ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸ್ಥಳ', 'parks', '08352-278545'),
    ('d1000000-0000-0000-0000-000000000007', 'Traffic & Signals', 'ಸಂಚಾರ ಮತ್ತು ಸಂಕೇತ', 'traffic', '08352-278546'),
    ('d1000000-0000-0000-0000-000000000008', 'General Administration', 'ಸಾಮಾನ್ಯ ಆಡಳಿತ', 'general', '08352-278539');

-- ============================================
-- ISSUE CATEGORIES (with SLA timers from product research)
-- ============================================

INSERT INTO issue_categories (name, name_kn, name_hi, slug, icon, department_id, default_severity, sla_acknowledge_hours, sla_begin_work_hours, sla_complete_hours, escalation_l1_hours, escalation_l2_hours, escalation_dc_hours, sort_order) VALUES
    ('Pothole / Bad Road', 'ಗುಂಡಿ / ಕೆಟ್ಟ ರಸ್ತೆ', 'गड्ढा / खराब सड़क', 'pothole', 'construction', 'd1000000-0000-0000-0000-000000000001', 'high', 24, 72, 360, 120, 360, 720, 1),
    ('Garbage / Waste Dumping', 'ಕಸ / ತ್ಯಾಜ್ಯ ಎಸೆಯುವಿಕೆ', 'कचरा / अपशिष्ट डंपिंग', 'garbage', 'trash', 'd1000000-0000-0000-0000-000000000002', 'high', 12, 24, 48, 24, 72, 168, 2),
    ('Broken Streetlight', 'ಮುರಿದ ಬೀದಿ ದೀಪ', 'टूटी स्ट्रीटलाइट', 'streetlight', 'lightbulb', 'd1000000-0000-0000-0000-000000000003', 'medium', 24, 48, 168, 72, 168, 336, 3),
    ('Drainage Problem', 'ಚರಂಡಿ ಸಮಸ್ಯೆ', 'जल निकासी समस्या', 'drainage', 'droplets', 'd1000000-0000-0000-0000-000000000004', 'high', 24, 48, 168, 72, 168, 336, 4),
    ('Water Leakage', 'ನೀರು ಸೋರಿಕೆ', 'पानी का रिसाव', 'water-leak', 'droplet', 'd1000000-0000-0000-0000-000000000005', 'high', 24, 48, 168, 72, 168, 336, 5),
    ('Open Manhole', 'ತೆರೆದ ಮ್ಯಾನ್ಹೋಲ್', 'खुला मैनहोल', 'manhole', 'alert-triangle', 'd1000000-0000-0000-0000-000000000004', 'critical', 1, 4, 24, 6, 24, 48, 6),
    ('Waterlogging', 'ನೀರು ನಿಲ್ಲುವಿಕೆ', 'जलभराव', 'waterlogging', 'waves', 'd1000000-0000-0000-0000-000000000004', 'high', 6, 12, 48, 12, 48, 120, 7),
    ('Damaged Footpath', 'ಹಾನಿಗೊಳಗಾದ ಪಾದಚಾರಿ ಮಾರ್ಗ', 'क्षतिग्रस्त फुटपाथ', 'footpath', 'footprints', 'd1000000-0000-0000-0000-000000000001', 'medium', 48, 168, 720, 168, 504, 1080, 8),
    ('Fallen Tree', 'ಬಿದ್ದ ಮರ', 'गिरा हुआ पेड़', 'fallen-tree', 'tree-pine', 'd1000000-0000-0000-0000-000000000006', 'high', 6, 12, 48, 12, 48, 120, 9),
    ('Public Toilet Issue', 'ಸಾರ್ವಜನಿಕ ಶೌಚಾಲಯ ಸಮಸ್ಯೆ', 'सार्वजनिक शौचालय समस्या', 'toilet', 'bath', 'd1000000-0000-0000-0000-000000000002', 'medium', 24, 48, 168, 72, 168, 336, 10),
    ('Traffic / Signal Issue', 'ಸಂಚಾರ / ಸಿಗ್ನಲ್ ಸಮಸ್ಯೆ', 'ट्रैफ़िक / सिग्नल समस्या', 'traffic', 'traffic-cone', 'd1000000-0000-0000-0000-000000000007', 'medium', 24, 48, 168, 72, 168, 336, 11),
    ('Other', 'ಇತರೆ', 'अन्य', 'other', 'circle-help', 'd1000000-0000-0000-0000-000000000008', 'low', 48, 168, 720, 168, 504, 1080, 12);

-- ============================================
-- WARDS (35 wards of Vijayapura City Corporation)
-- Note: Boundaries are approximate centroids as placeholder.
-- Real ward boundary polygons should be imported from official GIS data.
-- ============================================

INSERT INTO wards (ward_number, name, name_kn) VALUES
    (1, 'Adarsha Nagar', 'ಆದರ್ಶ ನಗರ'),
    (2, 'Adil Shahi Colony', 'ಆದಿಲ್ ಶಾಹಿ ಕಾಲೋನಿ'),
    (3, 'Aliabad', 'ಅಲಿಯಾಬಾದ್'),
    (4, 'Athani Galli', 'ಅಥಣಿ ಗಲ್ಲಿ'),
    (5, 'Babasaheb Ambedkar Nagar', 'ಬಾಬಾಸಾಹೇಬ ಅಂಬೇಡ್ಕರ್ ನಗರ'),
    (6, 'Bagalkot Road', 'ಬಾಗಲಕೋಟ ರಸ್ತೆ'),
    (7, 'Basaveshwar Nagar', 'ಬಸವೇಶ್ವರ ನಗರ'),
    (8, 'Budhihal Road', 'ಬುದಿಹಾಳ ರಸ್ತೆ'),
    (9, 'Darga Mohalla', 'ದರ್ಗಾ ಮೊಹಲ್ಲಾ'),
    (10, 'Dharmanath Circle', 'ಧರ್ಮನಾಥ ವೃತ್ತ'),
    (11, 'Gandhi Chowk', 'ಗಾಂಧಿ ಚೌಕ'),
    (12, 'Gol Gumbaz Area', 'ಗೋಲ್ ಗುಂಬಜ್ ಪ್ರದೇಶ'),
    (13, 'Governcoppa', 'ಗೋವರ್ನಕೊಪ್ಪ'),
    (14, 'Indi Road', 'ಇಂಡಿ ರಸ್ತೆ'),
    (15, 'Jaganur Road', 'ಜಗನೂರ ರಸ್ತೆ'),
    (16, 'Jamakhandi Galli', 'ಜಮಖಂಡಿ ಗಲ್ಲಿ'),
    (17, 'Jumnal', 'ಜುಮನಾಳ'),
    (18, 'Kalagi Road', 'ಕಲಗಿ ರಸ್ತೆ'),
    (19, 'Kesaratti', 'ಕೆಸರಟ್ಟಿ'),
    (20, 'Managoli Road', 'ಮಾನಗೋಳಿ ರಸ್ತೆ'),
    (21, 'Mohammadpur', 'ಮೊಹಮ್ಮದಪೂರ'),
    (22, 'Naaz Nagar', 'ನಾಜ್ ನಗರ'),
    (23, 'Naubad', 'ನೌಬಾದ್'),
    (24, 'Naya Mohalla', 'ನಯಾ ಮೊಹಲ್ಲಾ'),
    (25, 'Nehru Nagar', 'ನೆಹರು ನಗರ'),
    (26, 'Shahpur', 'ಶಹಾಪೂರ'),
    (27, 'Shivaji Nagar', 'ಶಿವಾಜಿ ನಗರ'),
    (28, 'Sindagi Road', 'ಸಿಂದಗಿ ರಸ್ತೆ'),
    (29, 'Solapur Road', 'ಸೊಲ್ಲಾಪೂರ ರಸ್ತೆ'),
    (30, 'Station Area', 'ಸ್ಟೇಷನ್ ಪ್ರದೇಶ'),
    (31, 'Torvi', 'ತೊರ್ವಿ'),
    (32, 'Vijayanagar', 'ವಿಜಯನಗರ'),
    (33, 'Vidyanagar', 'ವಿದ್ಯಾನಗರ'),
    (34, 'Yogapura', 'ಯೋಗಾಪುರ'),
    (35, 'Zubedinagar', 'ಜುಬೇದಿನಗರ');
