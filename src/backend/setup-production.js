#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupProduction() {
    console.log('🏥 MedTechAI Production Setup Starting...\n');

    // Check environment variables
    const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.error('\nPlease create a .env file based on .env.example');
        process.exit(1);
    }

    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    try {
        // Test database connection
        console.log('📡 Testing database connection...');
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful\n');

        // Run schema
        console.log('🗄️  Creating database schema...');
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        await pool.query(schemaSQL);
        console.log('✅ Database schema created\n');

        // Run seed data
        console.log('🌱 Seeding initial data...');
        const seedSQL = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
        await pool.query(seedSQL);
        console.log('✅ Initial data seeded\n');

        // Create admin user with secure password
        console.log('👤 Creating admin user...');
        const adminPassword = 'Admin123!'; // Change this in production
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        
        await pool.query(`
            INSERT INTO users (username, email, password_hash, role, first_name, last_name) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (username) DO UPDATE SET 
                password_hash = EXCLUDED.password_hash,
                updated_at = CURRENT_TIMESTAMP
        `, ['admin', 'admin@medtechai.com', hashedPassword, 'admin', 'System', 'Administrator']);
        
        console.log('✅ Admin user created');
        console.log(`   Username: admin`);
        console.log(`   Password: ${adminPassword}`);
        console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN\n');

        // Verify setup
        console.log('🔍 Verifying setup...');
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        const medicationCount = await pool.query('SELECT COUNT(*) FROM medications');
        const interactionCount = await pool.query('SELECT COUNT(*) FROM drug_interactions');
        
        console.log(`✅ Setup verification complete:`);
        console.log(`   - Users: ${userCount.rows[0].count}`);
        console.log(`   - Medications: ${medicationCount.rows[0].count}`);
        console.log(`   - Drug Interactions: ${interactionCount.rows[0].count}\n`);

        console.log('🎉 Production setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Change the admin password');
        console.log('   2. Configure SSL certificates');
        console.log('   3. Set up backup procedures');
        console.log('   4. Configure monitoring');
        console.log('   5. Review security settings\n');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('   - Ensure PostgreSQL is running');
        console.error('   - Check database credentials');
        console.error('   - Verify database exists');
        console.error('   - Check network connectivity\n');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run setup if called directly
if (require.main === module) {
    require('dotenv').config();
    setupProduction().catch(console.error);
}

module.exports = setupProduction;