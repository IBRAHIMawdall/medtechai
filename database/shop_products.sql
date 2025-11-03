-- MedTechAI Shop Products Seed Data
-- 100+ medical products ready for e-commerce

-- Medical Equipment & Devices
INSERT INTO products (name, description, short_description, category, sku, brand, base_price, sale_price, stock_quantity, is_featured, is_new, tags, images) VALUES
('Digital Blood Pressure Monitor', 'Automatic upper arm blood pressure monitor with large display and memory storage for 2 users', 'Professional grade blood pressure monitor', 'Medical Equipment', 'BP-MON-001', 'HealthPro', 49.99, 39.99, 150, true, false, ARRAY['blood pressure', 'monitor', 'health'], ARRAY['/images/products/bp-monitor.jpg']),

('Digital Thermometer Infrared', 'Non-contact forehead thermometer with instant readings and memory storage', 'Quick and accurate temperature readings', 'Medical Equipment', 'TEMP-INF-001', 'MedScan', 32.99, NULL, 200, false, true, ARRAY['thermometer', 'temperature'], ARRAY['/images/products/thermometer.jpg']),

('Pulse Oximeter Fingertip', 'Portable oxygen saturation monitor with OLED display and alarm function', 'Monitor your oxygen levels easily', 'Medical Equipment', 'OXI-FING-001', 'O2Check', 24.99, 19.99, 180, true, false, ARRAY['oxygen', 'spo2', 'pulse'], ARRAY['/images/products/oximeter.jpg']),

('Blood Glucose Meter Kit', 'Complete diabetes management kit with 50 test strips, lancets, and carrying case', 'All-in-one diabetes monitoring solution', 'Medical Equipment', 'GLU-KIT-001', 'DiabeticsCare', 45.99, NULL, 120, true, false, ARRAY['diabetes', 'glucose', 'blood sugar'], ARRAY['/images/products/glucometer.jpg']),

('Professional Stethoscope', 'High-quality dual-head stethoscope for medical professionals', 'Premium stethoscope for doctors', 'Medical Equipment', 'STETH-001', 'MedTools Pro', 89.99, 79.99, 75, false, false, ARRAY['stethoscope', 'doctor', 'professional'], ARRAY['/images/products/stethoscope.jpg']),

('N95 Face Masks (20 pack)', 'NIOSH approved N95 respirator masks with adjustable nose clip', 'Professional grade face masks', 'Medical Supplies', 'MASK-N95-20', 'SecureFace', 29.99, NULL, 500, true, false, ARRAY['masks', 'protection', 'ppe'], ARRAY['/images/products/n95.jpg']),

('Disposable Nitrile Gloves (100)', 'Powder-free latex-free examination gloves, medium size', 'High quality examination gloves', 'Medical Supplies', 'GLOVE-NIT-100', 'SafeHands', 12.99, NULL, 1000, false, true, ARRAY['gloves', 'disposable', 'protection'], ARRAY['/images/products/gloves.jpg']),

('First Aid Kit Deluxe', 'Comprehensive 299-piece first aid kit with organizer case', 'Complete emergency care solution', 'Medical Supplies', 'FAID-DELUXE', 'EmergencyCare', 39.99, 34.99, 80, true, false, ARRAY['first aid', 'emergency', 'safety'], ARRAY['/images/products/firstaid.jpg']),

('Knee Support Brace', 'Adjustable compression knee brace for sports and recovery', 'Comfortable knee support', 'Mobility Aids', 'KNEE-BRACE-001', 'ActiveSport', 32.99, NULL, 150, false, false, ARRAY['knee', 'brace', 'support'], ARRAY['/images/products/knee-brace.jpg']),

('Ankle Support Brace', 'Professional grade ankle brace for injury prevention and recovery', 'Strong ankle support', 'Mobility Aids', 'ANKLE-BRACE-001', 'ActiveSport', 28.99, NULL, 150, false, false, ARRAY['ankle', 'brace', 'injury'], ARRAY['/images/products/ankle-brace.jpg']),

-- OTC Pain Relief
('Tylenol Extra Strength (500mg)', 'Fast-acting acetaminophen tablets for pain relief and fever reduction', 'Reliable pain relief', 'Pain Relief', 'TYL-500-100', 'McNeil', 12.99, NULL, 300, false, true, ARRAY['pain', 'fever', 'tylenol'], ARRAY['/images/products/tylenol.jpg']),

('Advil Ibuprofen (200mg)', 'Coated ibuprofen tablets for muscle aches, pain, and inflammation', 'Reduce inflammation and pain', 'Pain Relief', 'ADV-200-100', 'Pfizer', 10.99, 8.99, 300, false, false, ARRAY['pain', 'ibuprofen', 'inflammation'], ARRAY['/images/products/advil.jpg']),

('Aleve Naproxen Sodium', 'Long-lasting 12-hour pain relief for arthritis and muscle pain', 'Extended relief formula', 'Pain Relief', 'ALE-220-100', 'Bayer', 11.99, NULL, 250, false, false, ARRAY['pain', 'arthritis', 'naproxen'], ARRAY['/images/products/aleve.jpg']),

('Aspirin Low Dose (81mg)', 'Low-dose aspirin for heart health and cardiovascular protection', 'Heart health support', 'Pain Relief', 'ASP-81-365', 'Bayer', 9.99, NULL, 400, false, true, ARRAY['aspirin', 'heart', 'cardiovascular'], ARRAY['/images/products/aspirin.jpg']),

('Bengay Pain Relief Cream', 'Topical pain relief cream for sore muscles and joints', 'Fast-acting topical relief', 'Pain Relief', 'BEN-CREAM-100', 'Johnson & Johnson', 8.99, NULL, 200, false, false, ARRAY['topical', 'cream', 'muscle pain'], ARRAY['/images/products/bengay.jpg']),

-- Vitamins & Supplements
('Vitamin D3 (1000 IU)', 'Daily vitamin D3 supplement for bone health and immune support', 'Essential vitamin D', 'Vitamins', 'VIT-D3-365', 'NatureMade', 15.99, NULL, 350, false, true, ARRAY['vitamin d', 'bone health', 'immunity'], ARRAY['/images/products/vitd3.jpg']),

('Complete Multivitamin Daily', 'Comprehensive daily multivitamin with essential nutrients', 'Complete daily nutrition', 'Vitamins', 'MULTI-DAY-365', 'Centrum', 22.99, 19.99, 400, true, false, ARRAY['multivitamin', 'nutrition', 'daily'], ARRAY['/images/products/multivitamin.jpg']),

('Calcium with Vitamin D', 'Bone-strengthening calcium supplement with vitamin D', 'Strong bones support', 'Vitamins', 'CALC-600-365', 'Caltrate', 14.99, NULL, 250, false, false, ARRAY['calcium', 'bones', 'vitamin d'], ARRAY['/images/products/calcium.jpg']),

('Magnesium Supplement', 'Natural magnesium for muscle and nerve function', 'Support muscle health', 'Vitamins', 'MAG-500-180', 'Naturewise', 16.99, NULL, 200, false, false, ARRAY['magnesium', 'muscles', 'nerve'], ARRAY['/images/products/magnesium.jpg']),

('B-Complex Vitamins', 'Energy-boosting B-complex with all essential B vitamins', 'Boost energy naturally', 'Vitamins', 'BCOMP-365', 'NatureMade', 18.99, NULL, 280, false, true, ARRAY['b vitamins', 'energy', 'metabolism'], ARRAY['/images/products/bcomplex.jpg']),

('Vitamin C (1000mg)', 'High-potency vitamin C for immune system support', 'Immune system booster', 'Vitamins', 'VIT-C-1000-365', 'NatureMade', 12.99, 10.99, 320, false, false, ARRAY['vitamin c', 'immune', 'antioxidant'], ARRAY['/images/products/vitc.jpg']),

('Omega-3 Fish Oil', 'Heart and brain health support with EPA and DHA', 'Cardiovascular health', 'Vitamins', 'OMEGA-1000-180', 'Nordic Naturals', 24.99, NULL, 180, true, false, ARRAY['omega-3', 'heart', 'brain'], ARRAY['/images/products/fishoil.jpg']),

-- Cold & Flu
('DayQuil Cold & Flu', 'Maximum strength daytime cold and flu relief without drowsiness', 'Daytime cold relief', 'Cold & Flu', 'DAYQUIL-12', 'Vicks', 9.99, NULL, 250, false, true, ARRAY['cold', 'flu', 'daytime'], ARRAY['/images/products/dayquill.jpg']),

('NyQuil Severe Cold & Flu', 'Maximum strength nighttime cold and flu with sleep aid', 'Nighttime cold relief', 'Cold & Flu', 'NYQUIL-12', 'Vicks', 9.99, NULL, 250, false, false, ARRAY['cold', 'flu', 'nighttime'], ARRAY['/images/products/nyquill.jpg']),

('Mucinex DM Expectorant', 'Long-lasting 12-hour chest congestion and cough relief', 'Clear chest congestion', 'Cold & Flu', 'MUC-DM-42', 'Reckitt', 11.99, NULL, 200, false, false, ARRAY['cough', 'congestion', 'expectorant'], ARRAY['/images/products/mucinex.jpg']),

('Vicks VapoRub', 'Medicated chest rub for cough and congestion relief', 'Classic cold relief', 'Cold & Flu', 'VICKS-VR-100', 'Vicks', 6.99, NULL, 300, false, false, ARRAY['vaporub', 'cough', 'topical'], ARRAY['/images/products/vaporub.jpg']),

('Chloraseptic Sore Throat Spray', 'Instant sore throat pain relief with anesthetic spray', 'Fast sore throat relief', 'Cold & Flu', 'CLOR-20ML', 'Prestige', 8.99, NULL, 150, false, false, ARRAY['throat', 'spray', 'anesthetic'], ARRAY['/images/products/chloraseptic.jpg']),

('Cough Drops Menthol', 'Long-lasting cough and sore throat relief drops', 'Soothing cough relief', 'Cold & Flu', 'COUGH-DROPS-80', 'Ricola', 4.99, NULL, 500, false, true, ARRAY['cough', 'drops', 'menthol'], ARRAY['/images/products/cough-drops.jpg']),

-- Digestive Health
('Tums Antacid Calcium', 'Fast-acting antacid for heartburn and indigestion relief', 'Instantly soothes heartburn', 'Digestive Health', 'TUMS-150-150', 'GSK', 5.99, NULL, 400, false, false, ARRAY['antacid', 'heartburn', 'indigestion'], ARRAY['/images/products/tums.jpg']),

('Pepto-Bismol Liquid', 'Multi-symptom relief for upset stomach, diarrhea, and nausea', 'Complete stomach relief', 'Digestive Health', 'PEPTO-473ML', 'Procter & Gamble', 7.99, NULL, 300, false, false, ARRAY['stomach', 'diarrhea', 'nausea'], ARRAY['/images/products/peptobismol.jpg']),

('Gas-X Chewable Tablets', 'Fast-acting relief from gas and bloating discomfort', 'Instantly relieves gas', 'Digestive Health', 'GASX-60', 'GlaxoSmithKline', 8.99, NULL, 250, false, true, ARRAY['gas', 'bloating', 'simethicone'], ARRAY['/images/products/gasx.jpg']),

('Miralax Laxative Powder', 'Gentle overnight constipation relief without cramping', 'Gentle constipation relief', 'Digestive Health', 'MIRALAX-119G', 'Bayer', 19.99, NULL, 150, false, false, ARRAY['constipation', 'laxative', 'gentle'], ARRAY['/images/products/miralax.jpg']),

('Probiotic Gummies Daily', 'Daily probiotic support for digestive and immune health', 'Support digestive health', 'Digestive Health', 'PROBI-90', 'Align', 29.99, 24.99, 180, true, false, ARRAY['probiotic', 'digestive', 'immune'], ARRAY['/images/products/probiotic.jpg']),

('Dramamine Motion Sickness', 'Prevents and relieves motion sickness and nausea', 'Motion sickness relief', 'Digestive Health', 'DRA-100-100', 'Prestige', 7.99, NULL, 120, false, false, ARRAY['motion sickness', 'nausea', 'travel'], ARRAY['/images/products/dramamine.jpg']),

-- Allergy Relief
('Claritin 24-Hour Non-Drowsy', 'Long-lasting allergy relief without drowsiness', '24-hour allergy relief', 'Allergy', 'CLAR-10-10', 'Bayer', 18.99, 15.99, 300, true, false, ARRAY['allergy', 'hay fever', 'non-drowsy'], ARRAY['/images/products/claritin.jpg']),

('Zyrtec Allergy Relief', 'Strong 24-hour allergy relief for indoor and outdoor allergies', 'Complete allergy relief', 'Allergy', 'ZYRT-10-10', 'Johnson & Johnson', 19.99, NULL, 280, false, true, ARRAY['allergy', 'antihistamine', '24-hour'], ARRAY['/images/products/zyrtec.jpg']),

('Benadryl Allergy Relief', 'Fast-acting allergy relief with drowsy formulation', 'Quick allergy relief', 'Allergy', 'BEN-25-50', 'Johnson & Johnson', 10.99, NULL, 250, false, false, ARRAY['allergy', 'benadryl', 'diphenhydramine'], ARRAY['/images/products/benadryl.jpg']),

('Flonase Nasal Spray', 'Prescription-strength allergy nasal spray for daily relief', 'Daily allergy control', 'Allergy', 'FLON-50-60', 'GlaxoSmithKline', 22.99, NULL, 150, false, false, ARRAY['allergy', 'nasal spray', 'daily'], ARRAY['/images/products/flonase.jpg']),

('Cortizone-10 Cream', 'Hydrocortisone cream for itching and skin irritation', 'Itch relief cream', 'Allergy', 'CORT-10-28G', 'Bayer', 6.99, NULL, 200, false, false, ARRAY['itch', 'cortisone', 'skin'], ARRAY['/images/products/cortizone.jpg']),

-- Personal Care
('Neutrogena Body Moisturizer', 'Deeply hydrating body lotion for dry skin care', 'Deep hydration', 'Personal Care', 'NEU-BODY-400ML', 'Neutrogena', 9.99, NULL, 150, false, true, ARRAY['moisturizer', 'dry skin', 'body'], ARRAY['/images/products/neutrogena.jpg']),

('CeraVe Facial Cleanser', 'Gentle foaming facial cleanser for normal to oily skin', 'Gentle face cleansing', 'Personal Care', 'CER-FACE-355ML', 'CeraVe', 13.99, NULL, 120, false, false, ARRAY['cleanser', 'face', 'sensitive'], ARRAY['/images/products/cerave.jpg']),

('Oral-B Electric Toothbrush', 'Rechargeable electric toothbrush with multiple modes', 'Professional cleaning', 'Personal Care', 'ORAL-B-REVO', 'Oral-B', 89.99, 79.99, 80, true, false, ARRAY['toothbrush', 'electric', 'oral care'], ARRAY['/images/products/electric-brush.jpg']),

('Listerine Antiseptic Mouthwash', 'Therapeutic mouthwash that kills 99.9% of germs', 'Comprehensive oral care', 'Personal Care', 'LIST-LIT-946ML', 'Johnson & Johnson', 6.99, NULL, 400, false, false, ARRAY['mouthwash', 'antiseptic', 'oral'], ARRAY['/images/products/listerine.jpg']),

('Teeth Whitening Strips', 'Professional-grade teeth whitening strips kit', 'Whiten teeth at home', 'Personal Care', 'WHITE-14', 'Crest', 44.99, 39.99, 100, true, false, ARRAY['whitening', 'teeth', 'smile'], ARRAY['/images/products/whitening.jpg']),

('Sensodyne Toothpaste Sensitive', 'Relief for sensitive teeth and gums', 'Sensitive teeth care', 'Personal Care', 'SENS-170G', 'Sensodyne', 8.99, NULL, 350, false, false, ARRAY['sensitive', 'toothpaste', 'teeth'], ARRAY['/images/products/sensodyne.jpg']),

-- Wellness & Fitness
('Digital Body Weight Scale', 'Smart scale with body composition tracking and app sync', 'Track your progress', 'Fitness', 'SCALE-SMART', 'FitTrack', 49.99, NULL, 90, true, false, ARRAY['scale', 'fitness', 'weight'], ARRAY['/images/products/smart-scale.jpg']),

('Resistance Bands Set', 'Complete resistance band workout set with 5 levels', 'Full body workout', 'Fitness', 'BAND-SET-5', 'ActiveFlex', 24.99, 19.99, 150, false, true, ARRAY['resistance', 'bands', 'workout'], ARRAY['/images/products/bands.jpg']),

('Yoga Mat Premium', 'Extra thick non-slip yoga and exercise mat', 'Comfortable workouts', 'Fitness', 'YOGA-MAT-THICK', 'Namaste', 39.99, NULL, 100, false, false, ARRAY['yoga', 'mat', 'exercise'], ARRAY['/images/products/yoga-mat.jpg']),

('Foam Roller Full Body', 'High-density foam roller for muscle recovery', 'Relieve muscle tension', 'Fitness', 'FOAM-ROLL-36', 'ProSport', 19.99, NULL, 120, false, false, ARRAY['foam', 'roller', 'recovery'], ARRAY['/images/products/foam-roller.jpg']),

('Posture Correcting Brace', 'Adjustable posture support brace for back and shoulders', 'Improve your posture', 'Fitness', 'POSTURE-BRACE', 'PostureCare', 29.99, NULL, 80, false, true, ARRAY['posture', 'back', 'support'], ARRAY['/images/products/posture-brace.jpg']),

-- Sleep & Wellness
('Melatonin Sleep Aid (3mg)', 'Natural sleep aid supplement for restful nights', 'Better sleep naturally', 'Sleep & Wellness', 'MEL-3-100', 'Natrol', 12.99, NULL, 250, true, false, ARRAY['melatonin', 'sleep', 'natural'], ARRAY['/images/products/melatonin.jpg']),

('Weighted Blanket (15 lbs)', 'Therapeutic weighted blanket for anxiety and better sleep', 'Calming sleep aid', 'Sleep & Wellness', 'BLANKET-15', 'CalmingCloud', 79.99, NULL, 45, true, false, ARRAY['weighted', 'blanket', 'anxiety'], ARRAY['/images/products/weighted-blanket.jpg']),

('Sleep Mask Silk', 'Comfortable silk sleep mask for blackout sleep', 'Better sleep', 'Sleep & Wellness', 'SLEEP-MASK-SILK', 'SleepBetter', 18.99, NULL, 100, false, false, ARRAY['sleep', 'mask', 'darkness'], ARRAY['/images/products/sleep-mask.jpg']),

('Essential Oil Diffuser', 'Ultrasonic diffuser with LED lighting and timer', 'Aromatherapy at home', 'Sleep & Wellness', 'DIFFUSE-LED', 'AromaPure', 34.99, NULL, 75, false, true, ARRAY['diffuser', 'aromatherapy', 'essential'], ARRAY['/images/products/diffuser.jpg']),

('Lavender Essential Oil', '100% pure lavender essential oil for relaxation', 'Natural relaxation', 'Sleep & Wellness', 'OIL-LAV-15ML', 'NaturePure', 12.99, NULL, 200, false, false, ARRAY['lavender', 'oil', 'relaxation'], ARRAY['/images/products/lavender.jpg']),

-- Women's Health
('Prenatal Vitamins Daily', 'Complete prenatal nutrition for expecting mothers', 'Support healthy pregnancy', 'Women Health', 'PREG-365', 'One A Day', 24.99, NULL, 150, true, false, ARRAY['prenatal', 'pregnancy', 'vitamins'], ARRAY['/images/products/prenatal.jpg']),

('Iron Supplement Women', 'High-potency iron for women with vitamin C', 'Support energy levels', 'Women Health', 'IRON-65-100', 'Slow-Fe', 15.99, NULL, 180, false, true, ARRAY['iron', 'women', 'energy'], ARRAY['/images/products/iron.jpg']),

('Pregnancy Test (2 pack)', 'Early detection pregnancy test with clear results', 'Accurate early testing', 'Women Health', 'PREG-TEST-2', 'First Response', 12.99, NULL, 200, false, false, ARRAY['pregnancy', 'test', 'early'], ARRAY['/images/products/preg-test.jpg']),

-- Men's Health
('Prostate Health Supplement', 'Saw palmetto and pumpkin seed for prostate support', 'Support prostate health', 'Men Health', 'PROSTATE-180', 'ProstateCare', 29.99, NULL, 120, false, false, ARRAY['prostate', 'men', 'health'], ARRAY['/images/products/prostate.jpg']),

('Men Multivitamin 50+', 'Complete daily multivitamin for men over 50', 'Age-specific nutrition', 'Men Health', 'MEN-50-365', 'Centrum Silver', 24.99, 22.99, 150, false, true, ARRAY['multivitamin', 'men', 'senior'], ARRAY['/images/products/mens-multi.jpg']),

-- Baby & Children
('Baby Thermometer Digital', 'Fast and gentle digital thermometer for babies', 'Safe for babies', 'Baby Care', 'BABY-TEMP', 'SafetyFirst', 22.99, NULL, 80, true, false, ARRAY['baby', 'thermometer', 'digital'], ARRAY['/images/products/baby-temp.jpg']),

('Diaper Rash Cream', 'Zinc oxide formula for diaper rash relief', 'Soothe diaper rash', 'Baby Care', 'DIAPER-RASH-100', 'Desitin', 8.99, NULL, 200, false, false, ARRAY['diaper', 'rash', 'baby'], ARRAY['/images/products/diaper-cream.jpg']),

('Children Multivitamin Gummies', 'Delicious gummy vitamins for growing kids', 'Kids love these vitamins', 'Baby Care', 'KIDS-MULTI-150', 'Vitafusion', 19.99, 16.99, 250, false, true, ARRAY['kids', 'vitamins', 'gummies'], ARRAY['/images/products/kids-vitamins.jpg']),

('Baby Nasal Aspirator', 'Gentle bulb suction for baby nasal congestion', 'Clear baby congestion', 'Baby Care', 'BABY-NASAL', 'Little Remedies', 6.99, NULL, 150, false, false, ARRAY['baby', 'nasal', 'congestion'], ARRAY['/images/products/nasal-aspirator.jpg']),

-- Senior Care
('Hearing Aid Batteries (12)', 'Long-lasting zinc-air hearing aid batteries', 'Power your hearing aids', 'Senior Care', 'HEAR-BATT-12', 'Duracell', 12.99, NULL, 180, false, false, ARRAY['hearing', 'batteries', 'aids'], ARRAY['/images/products/hearing-batt.jpg']),

('Reading Glasses +2.50', 'Stylish reading glasses for close-up tasks', 'Clear reading vision', 'Senior Care', 'READ-GLASS-250', 'Eyeglasses Pro', 19.99, NULL, 120, false, true, ARRAY['reading', 'glasses', 'vision'], ARRAY['/images/products/reading-glasses.jpg']),

('Pill Organizer Weekly', 'Large-compartment weekly pill organizer', 'Never miss medication', 'Senior Care', 'PILL-ORG-WEEK', 'Organizer Plus', 9.99, NULL, 200, false, false, ARRAY['pill', 'organizer', 'weekly'], ARRAY['/images/products/pill-organizer.jpg']),

('Grabber Reacher Tool', 'Extended reach tool for hard-to-reach items', 'Independent living aid', 'Senior Care', 'GRABBER-32', 'HelpTech', 14.99, NULL, 90, false, false, ARRAY['grabber', 'reaching', 'senior'], ARRAY['/images/products/grabber.jpg']),

-- Travel Health
('Travel First Aid Kit', 'Compact travel-sized first aid essentials', 'Stay prepared on the go', 'Travel', 'TRAVEL-FAID', 'TravelSafe', 14.99, NULL, 100, false, true, ARRAY['travel', 'first aid', 'portable'], ARRAY['/images/products/travel-kit.jpg']),

('Hand Sanitizer (2oz)', 'Alcohol-based hand sanitizer with moisturizers', 'Clean hands anywhere', 'Travel', 'HANDSAN-2OZ', 'Purell', 3.99, NULL, 500, false, false, ARRAY['sanitizer', 'hands', 'travel'], ARRAY['/images/products/sanitizer.jpg']),

('Motion Sickness Patches', 'Acupressure wristbands for motion sickness', 'Natural motion relief', 'Travel', 'MOTION-BAND', 'Sea-Band', 9.99, NULL, 150, false, false, ARRAY['motion', 'travel', 'sea-band'], ARRAY['/images/products/motion-band.jpg']),

-- Specialty Items
('Compression Stockings', 'Graduated compression for circulation support', 'Support leg health', 'Specialty', 'COMP-SOCK-M', 'Jobst', 34.99, NULL, 80, false, true, ARRAY['compression', 'stockings', 'circulation'], ARRAY['/images/products/compression.jpg']),

('Adult Incontinence Briefs', 'Overnight protection briefs for adults', 'Discreet protection', 'Specialty', 'BRIEF-M-30', 'Depends', 28.99, NULL, 60, false, false, ARRAY['incontinence', 'briefs', 'protection'], ARRAY['/images/products/briefs.jpg']),

('CPAP Mask Full Face', 'Comfortable full face CPAP mask with headgear', 'Better sleep apnea treatment', 'Specialty', 'CPAP-FULL', 'Respironics', 89.99, 79.99, 40, true, false, ARRAY['cpap', 'sleep apnea', 'mask'], ARRAY['/images/products/cpap-mask.jpg']),

('Diabetic Socks', 'Non-binding diabetic socks with moisture-wicking', 'Foot health for diabetics', 'Specialty', 'SOCKS-DIA-6', 'SockWell', 24.99, NULL, 100, false, false, ARRAY['diabetic', 'socks', 'foot care'], ARRAY['/images/products/diabetic-socks.jpg']),

-- Additional Popular Items
('Lubricating Eye Drops', 'Soothing artificial tears for dry eyes', 'Instant dry eye relief', 'Eye Care', 'EYES-REFRESH-15', 'Refresh', 7.99, NULL, 250, false, true, ARRAY['eyes', 'dry', 'drops'], ARRAY['/images/products/eye-drops.jpg']),

('Wart Remover Gel', 'Effective wart removal treatment', 'Remove warts safely', 'Skin Care', 'WART-GEL-7', 'Compound W', 9.99, NULL, 100, false, false, ARRAY['warts', 'removal', 'treatment'], ARRAY['/images/products/wart-remover.jpg']),

('Athlete Foot Cream', 'Fungus-fighting athlete foot treatment', 'Cure athlete foot', 'Skin Care', 'ATHLETE-FT-45', 'Lotrimin', 8.99, NULL, 120, false, false, ARRAY['athlete foot', 'fungus', 'treatment'], ARRAY['/images/products/athlete-foot.jpg']),

('Canker Sore Relief Gel', 'Instantly relieves canker sore pain', 'Fast sore relief', 'Oral Care', 'CANKER-GEL', 'Orajel', 7.99, NULL, 150, false, true, ARRAY['canker', 'sores', 'pain'], ARRAY['/images/products/canker.jpg']),

('Fiber Supplement Powder', 'Natural psyllium fiber for digestive health', 'Support regularity', 'Digestive Health', 'FIBER-MET-32', 'Metamucil', 16.99, NULL, 180, true, false, ARRAY['fiber', 'digestive', 'regularity'], ARRAY['/images/products/fiber.jpg']),

('Hemorrhoid Treatment', 'Soothing cream for hemorrhoid relief', 'Comfort and relief', 'Digestive Health', 'HEM-CREAM', 'Preparation H', 11.99, NULL, 90, false, false, ARRAY['hemorrhoid', 'relief', 'cream'], ARRAY['/images/products/hemorrhoid.jpg']),

('Dandruff Shampoo', 'Anti-dandruff treatment shampoo', 'Control dandruff', 'Hair Care', 'SHAMPOO-DAN-400', 'Head & Shoulders', 7.99, NULL, 250, false, false, ARRAY['dandruff', 'shampoo', 'hair'], ARRAY['/images/products/dandruff.jpg']),

('Hydrogen Peroxide 3%', 'Antiseptic for minor cuts and wounds', 'Clean wounds safely', 'First Aid', 'PEROX-32OZ', 'Generic', 3.99, NULL, 300, false, false, ARRAY['peroxide', 'antiseptic', 'wound'], ARRAY['/images/products/peroxide.jpg']),

('Rubbing Alcohol 70%', 'Antiseptic solution for wound care', 'Disinfect and clean', 'First Aid', 'ALC-70-16OZ', 'Generic', 4.99, NULL, 300, false, true, ARRAY['alcohol', 'antiseptic', 'first aid'], ARRAY['/images/products/alcohol.jpg']),

('Medical Tape Hypoallergenic', 'Gentle medical tape for sensitive skin', 'Secure dressings safely', 'First Aid', 'TAPE-1IN', 'Nexcare', 5.99, NULL, 200, false, false, ARRAY['tape', 'medical', 'sensitive'], ARRAY['/images/products/tape.jpg']),

('Cotton Balls (200)', 'Sterile cotton balls for medical use', 'Medical grade cotton', 'First Aid', 'COTTON-200', 'Generic', 3.99, NULL, 400, false, false, ARRAY['cotton', 'medical', 'sterile'], ARRAY['/images/products/cotton.jpg']),

('Bandage Assortment Pack', 'Complete variety pack of bandages and dressings', 'All your bandage needs', 'First Aid', 'BANDAGE-ASSORT', 'Band-Aid', 8.99, NULL, 200, false, true, ARRAY['bandages', 'dressings', 'wound'], ARRAY['/images/products/bandages.jpg']),

('Digital Kitchen Scale', 'Precise gram scale for medications and food', 'Accurate measurements', 'Specialty', 'SCALE-DIGI', 'Ozeri', 19.99, NULL, 100, false, false, ARRAY['scale', 'precision', 'kitchen'], ARRAY['/images/products/digital-scale.jpg']),

('Pill Crusher & Cutter', 'Dual-function pill crusher and cutter', 'Easy medication preparation', 'Specialty', 'PILL-CRUSH', 'Carex', 12.99, NULL, 80, false, false, ARRAY['pill', 'crusher', 'cutter'], ARRAY['/images/products/pill-crusher.jpg']),

('Breast Pump Manual', 'Gentle manual breast pump for nursing mothers', 'Comfortable pumping', 'Baby Care', 'PUMP-MANUAL', 'Medela', 34.99, NULL, 50, true, false, ARRAY['breast pump', 'nursing', 'baby'], ARRAY['/images/products/pump.jpg']),

('Nipple Cream Nursing', 'Soothing lanolin cream for nursing mothers', 'Comfort for nursing', 'Baby Care', 'NIP-CREAM', 'Lansinoh', 11.99, NULL, 100, false, false, ARRAY['nipple', 'nursing', 'lanolin'], ARRAY['/images/products/nipple-cream.jpg']),

('Baby Shampoo Tear-Free', 'Gentle tear-free shampoo and body wash', 'Safe for babies', 'Baby Care', 'BABY-SHAMPOO', 'Johnson Baby', 5.99, NULL, 300, false, true, ARRAY['baby', 'shampoo', 'tear-free'], ARRAY['/images/products/baby-shampoo.jpg']),

('Digital Heart Rate Monitor', 'Chest strap heart rate monitor with watch display', 'Track your heart rate', 'Fitness', 'HR-MONITOR', 'Polar', 79.99, 69.99, 60, true, false, ARRAY['heart rate', 'fitness', 'monitor'], ARRAY['/images/products/hr-monitor.jpg']),

('Compression Ankle Sleeves', 'Athletic compression sleeves for ankle support', 'Sports ankle support', 'Fitness', 'ANKLE-SLEEVE', 'CEP', 39.99, NULL, 80, false, false, ARRAY['ankle', 'compression', 'sports'], ARRAY['/images/products/ankle-sleeve.jpg']),

('Knee Sleeves Pair', 'Heavy-duty knee sleeves for weightlifting', 'Support heavy training', 'Fitness', 'KNEE-SLEEVE-PAIR', 'StrongFit', 49.99, NULL, 70, false, true, ARRAY['knee', 'weightlifting', 'support'], ARRAY['/images/products/knee-sleeve.jpg']),

('Wrist Wraps Support', 'Professional wrist wraps for lifting and sports', 'Protect your wrists', 'Fitness', 'WRIST-WRAP', 'Harbinger', 19.99, NULL, 90, false, false, ARRAY['wrist', 'support', 'lifting'], ARRAY['/images/products/wrist-wrap.jpg']),

('Grip Strengthener Kit', 'Progressive grip strength training kit', 'Build hand strength', 'Fitness', 'GRIP-KIT', 'Captains of Crush', 29.99, NULL, 50, false, false, ARRAY['grip', 'strength', 'hands'], ARRAY['/images/products/grip.jpg']),

('Back Massager Electric', 'Handheld electric massager for muscle relief', 'Relieve muscle pain', 'Fitness', 'BACK-MASSAGER', 'HoMedics', 49.99, 44.99, 60, true, false, ARRAY['massager', 'back', 'electric'], ARRAY['/images/products/massager.jpg']),

('Hot/Cold Therapy Pack', 'Reusable hot and cold therapy gel pack', 'Pain relief therapy', 'Fitness', 'THERAPY-PACK-L', 'Therabrand', 19.99, NULL, 100, false, true, ARRAY['therapy', 'hot', 'cold'], ARRAY['/images/products/therapy-pack.jpg']),

('Shower Chair with Back', 'Adjustable height shower chair for safety', 'Safe bathing aid', 'Mobility Aids', 'SHOWER-CHAIR', 'Drive Medical', 69.99, NULL, 40, false, false, ARRAY['shower', 'chair', 'safety'], ARRAY['/images/products/shower-chair.jpg']),

('Bed Rail Safety', 'Adjustable bed safety rail', 'Safer sleep and rising', 'Mobility Aids', 'BED-RAIL', 'Carex', 79.99, NULL, 35, false, false, ARRAY['bed rail', 'safety', 'senior'], ARRAY['/images/products/bed-rail.jpg']),

('Walker with Seat', 'Lightweight folding walker with built-in seat', 'Support and rest', 'Mobility Aids', 'WALKER-SEAT', 'Medline', 89.99, 79.99, 45, true, false, ARRAY['walker', 'mobility', 'seat'], ARRAY['/images/products/walker.jpg']),

('Crutches Underarm', 'Adjustable underarm crutches set', 'Temporary mobility aid', 'Mobility Aids', 'CRUTCH-UNDER', 'DuroMed', 49.99, NULL, 50, false, true, ARRAY['crutches', 'mobility', 'injury'], ARRAY['/images/products/crutches.jpg']),

('Cane Quad Base', 'Stable 4-point base cane for balance', 'Maximum stability', 'Mobility Aids', 'CANE-QUAD', 'Carex', 34.99, NULL, 80, false, false, ARRAY['cane', 'walking', 'balance'], ARRAY['/images/products/quad-cane.jpg']);

-- Mark HSA eligible products
UPDATE products SET is_hsa_eligible = true 
WHERE category IN ('Medical Equipment', 'Medical Supplies', 'Digestive Health', 'Sleep & Wellness', 'Specialty');

-- Update some with better ratings and reviews
UPDATE products SET rating = 4.5, review_count = 127 WHERE sku = 'BP-MON-001';
UPDATE products SET rating = 4.7, review_count = 89 WHERE sku = 'OXI-FING-001';
UPDATE products SET rating = 4.6, review_count = 234 WHERE sku = 'GLU-KIT-001';
UPDATE products SET rating = 4.8, review_count = 156 WHERE sku = 'MULTI-DAY-365';
UPDATE products SET rating = 4.4, review_count = 342 WHERE sku = 'CLAR-10-10';

