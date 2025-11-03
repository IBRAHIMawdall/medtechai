const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Load .env from root
const bcrypt = require('bcryptjs');

const { Pool } = require('pg');
const servicesData = require('./routes/services-data');

async function setupDatabase() {
    let client;
    const mainDbUrl = process.env.DATABASE_URL;
    if (!mainDbUrl) {
        console.error('❌ DATABASE_URL environment variable not set. Please check your .env file.');
        process.exit(1);
    }

    // Use a separate admin/superuser connection string if provided, otherwise derive from DATABASE_URL
    const adminConnectionString = process.env.DB_ADMIN_URL || mainDbUrl;

    // Create a temporary pool to connect to the default 'postgres' database
    // This connection needs privileges to create databases.
    const dbUrl = new URL(adminConnectionString);
    const dbName = dbUrl.pathname.slice(1); // Get 'medtechai'
    dbUrl.pathname = '/postgres'; // Connect to default db first
    const tempPool = new Pool({
        connectionString: dbUrl.toString(),
        // Explicitly disable SSL for local admin tasks for consistency
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    try {
        console.log(`Checking for database "${dbName}"...`);
        const tempClient = await tempPool.connect();
        const res = await tempClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" not found. Creating it...`);
            await tempClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database "${dbName}" created successfully.`);
        } else {
            console.log(`ℹ️ Database "${dbName}" already exists.`);
        }
        tempClient.release();
    } catch (error) {
        console.error('❌ Error checking/creating database:', error.message);
        process.exit(1);
    } finally {
        await tempPool.end();
    }

    // Now, connect to the actual project database ('medtechai')
    const pool = new Pool({
        connectionString: mainDbUrl,
        // Use the same SSL logic as the main application db connection
        ssl:
            process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false } : false,
    });

    try {
        console.log('📡 Connecting to the database...');
        client = await pool.connect();
        console.log('✅ Database connection successful.');

        // Create a function to automatically update 'updated_at' timestamps
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
               NEW.updated_at = NOW(); 
               RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                phone VARCHAR(50),
                license_number VARCHAR(100),
                role VARCHAR(50) DEFAULT 'patient',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Prescriptions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                medication_name VARCHAR(255) NOT NULL,
                dosage VARCHAR(100),
                frequency VARCHAR(100),
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Consultations table
        await client.query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                notes TEXT,
                scheduled_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Audit Log table
        await client.query(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                table_name VARCHAR(100),
                record_id INTEGER,
                ip_address VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Patients table (referenced in auth.js)
        await client.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                date_of_birth DATE,
                gender VARCHAR(50),
                address TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Services table
        await client.query(`
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100),
                price NUMERIC(10, 2),
                image_url VARCHAR(255),
                details TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Database tables created successfully.');

        // Apply the 'updated_at' trigger to tables using CREATE OR REPLACE
        console.log('🔧 Applying triggers for automatic timestamp updates...');
        await client.query(`
            CREATE OR REPLACE TRIGGER set_timestamp_users
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);

        await client.query(`
            CREATE OR REPLACE TRIGGER set_timestamp_services
            BEFORE UPDATE ON services
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);

        await client.query(`
            CREATE OR REPLACE TRIGGER set_timestamp_patients
            BEFORE UPDATE ON patients
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);

        await client.query(`
            CREATE OR REPLACE TRIGGER set_timestamp_prescriptions
            BEFORE UPDATE ON prescriptions
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);

        await client.query(`
            CREATE OR REPLACE TRIGGER set_timestamp_consultations
            BEFORE UPDATE ON consultations
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);
        console.log('✅ Triggers applied successfully.');

        // Seed services data if the table is empty
        const { rows } = await client.query('SELECT COUNT(*) FROM services');
        if (rows[0].count === '0') {
            console.log('🌱 Seeding services data...');
            try {
                await client.query('BEGIN'); // Start transaction
                for (const service of servicesData) {
                    await client.query(
                        `INSERT INTO services (name, description, category, price, image_url, details)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            service.name,
                            service.description,
                            service.category,
                            service.price,
                            service.imageUrl,
                            service.details,
                        ]
                    );
                }
                await client.query('COMMIT'); // Commit transaction
                console.log('✅ Services data seeded successfully.');
            } catch (seedError) {
                await client.query('ROLLBACK'); // Rollback on error
                console.error('❌ Error seeding services data. Rolled back transaction.', seedError);
                throw seedError; // Re-throw to be caught by outer catch block
            }
        } else {
            console.log('ℹ️ Services table already contains data. Skipping seeding.');
        }

        // Seed a default admin user if no admin exists
        const adminCheck = await client.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        if (adminCheck.rowCount === 0) {
            console.log('🌱 Seeding default admin user...');
            const adminUsername = process.env.ADMIN_USER || 'admin';
            const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@medtechai.com';

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(adminPassword, salt);

            await client.query(
                `INSERT INTO users (username, email, password_hash, role, first_name, last_name, is_active)
                 VALUES ($1, $2, $3, 'admin', 'Default', 'Admin', true)`,
                [adminUsername, adminEmail, passwordHash]
            );
            console.log('✅ Default admin user created.');
            console.log('   - Username:', adminUsername);
            console.log('   - Password:', adminPassword, '(Please change this in a production environment)');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping seeding.');
        }


    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    } finally {
        if (client) client.release();
        await pool.end();
        console.log('👋 Database setup finished. Connection closed.');
    }
}

setupDatabase();