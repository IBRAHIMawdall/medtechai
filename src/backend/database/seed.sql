-- Real medication data seeding
INSERT INTO medications (name, generic_name, brand_names, ndc_number, strength, dosage_form, route, manufacturer, drug_class) VALUES
('Lisinopril', 'lisinopril', ARRAY['Prinivil', 'Zestril'], '0093-7663-56', '10 mg', 'tablet', 'oral', 'Teva Pharmaceuticals', 'ACE Inhibitor'),
('Metformin', 'metformin hydrochloride', ARRAY['Glucophage', 'Fortamet'], '0093-1074-01', '500 mg', 'tablet', 'oral', 'Teva Pharmaceuticals', 'Biguanide'),
('Atorvastatin', 'atorvastatin calcium', ARRAY['Lipitor'], '0071-0155-23', '20 mg', 'tablet', 'oral', 'Pfizer', 'HMG-CoA Reductase Inhibitor'),
('Amlodipine', 'amlodipine besylate', ARRAY['Norvasc'], '0093-5892-56', '5 mg', 'tablet', 'oral', 'Teva Pharmaceuticals', 'Calcium Channel Blocker'),
('Omeprazole', 'omeprazole', ARRAY['Prilosec'], '0093-7540-56', '20 mg', 'capsule', 'oral', 'Teva Pharmaceuticals', 'Proton Pump Inhibitor'),
('Levothyroxine', 'levothyroxine sodium', ARRAY['Synthroid', 'Levoxyl'], '0074-3105-90', '50 mcg', 'tablet', 'oral', 'AbbVie', 'Thyroid Hormone'),
('Sertraline', 'sertraline hydrochloride', ARRAY['Zoloft'], '0093-7146-56', '50 mg', 'tablet', 'oral', 'Teva Pharmaceuticals', 'SSRI'),
('Ibuprofen', 'ibuprofen', ARRAY['Advil', 'Motrin'], '0363-0323-01', '200 mg', 'tablet', 'oral', 'Walgreens', 'NSAID'),
('Warfarin', 'warfarin sodium', ARRAY['Coumadin', 'Jantoven'], '0056-0173-70', '5 mg', 'tablet', 'oral', 'Bristol Myers Squibb', 'Anticoagulant'),
('Insulin Glargine', 'insulin glargine', ARRAY['Lantus'], '0088-2220-33', '100 units/mL', 'injection', 'subcutaneous', 'Sanofi', 'Long-acting Insulin');

-- Real drug interactions
INSERT INTO drug_interactions (drug_a_id, drug_b_id, severity, description, mechanism, management, source) VALUES
((SELECT id FROM medications WHERE name = 'Warfarin'), (SELECT id FROM medications WHERE name = 'Ibuprofen'), 'major', 'Increased risk of bleeding', 'NSAIDs inhibit platelet aggregation and may cause GI bleeding', 'Monitor INR closely, consider alternative pain management', 'FDA Drug Interactions Database'),
((SELECT id FROM medications WHERE name = 'Lisinopril'), (SELECT id FROM medications WHERE name = 'Ibuprofen'), 'moderate', 'Reduced antihypertensive effect', 'NSAIDs may reduce ACE inhibitor effectiveness', 'Monitor blood pressure, use lowest effective NSAID dose', 'Clinical Studies'),
((SELECT id FROM medications WHERE name = 'Sertraline'), (SELECT id FROM medications WHERE name = 'Warfarin'), 'moderate', 'Increased bleeding risk', 'SSRIs may potentiate anticoagulant effects', 'Monitor INR more frequently', 'FDA Drug Interactions Database'),
((SELECT id FROM medications WHERE name = 'Omeprazole'), (SELECT id FROM medications WHERE name = 'Warfarin'), 'moderate', 'Increased warfarin levels', 'PPI may inhibit warfarin metabolism', 'Monitor INR when starting/stopping PPI', 'Clinical Studies');

-- Sample users
INSERT INTO users (username, email, password_hash, role, first_name, last_name, license_number, phone) VALUES
('admin', 'admin@medtechai.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjO', 'admin', 'System', 'Administrator', NULL, '555-0100'),
('dr.smith', 'dr.smith@medtechai.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjO', 'doctor', 'John', 'Smith', 'MD123456', '555-0101'),
('pharm.jones', 'pharm.jones@medtechai.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjO', 'pharmacist', 'Sarah', 'Jones', 'RPH789012', '555-0102'),
('patient.doe', 'john.doe@email.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjO', 'patient', 'John', 'Doe', NULL, '555-0103');

-- Sample patients
INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, insurance_provider, allergies, medical_conditions) VALUES
((SELECT id FROM users WHERE username = 'patient.doe'), '1980-05-15', 'male', '123 Main St, Anytown, ST 12345', 'Jane Doe', '555-0104', 'Blue Cross Blue Shield', ARRAY['Penicillin', 'Shellfish'], ARRAY['Hypertension', 'Type 2 Diabetes']);

-- Sample inventory
INSERT INTO inventory (medication_id, lot_number, expiration_date, quantity_on_hand, unit_cost, supplier, location, minimum_stock_level) VALUES
((SELECT id FROM medications WHERE name = 'Lisinopril'), 'LOT001', '2025-12-31', 500, 0.15, 'McKesson', 'A1-B2', 50),
((SELECT id FROM medications WHERE name = 'Metformin'), 'LOT002', '2025-11-30', 750, 0.12, 'Cardinal Health', 'A2-B1', 100),
((SELECT id FROM medications WHERE name = 'Atorvastatin'), 'LOT003', '2025-10-31', 300, 0.85, 'AmerisourceBergen', 'A3-B3', 25),
((SELECT id FROM medications WHERE name = 'Amlodipine'), 'LOT004', '2026-01-31', 400, 0.18, 'McKesson', 'A1-B4', 40),
((SELECT id FROM medications WHERE name = 'Omeprazole'), 'LOT005', '2025-09-30', 200, 0.45, 'Cardinal Health', 'A2-B5', 30);