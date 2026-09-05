import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runSqlFile(client: Client, filePath: string) {
    console.log(`Running ${filePath}...`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    await client.query(sql);
}

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // Run migrations
        const migrationsDir = path.join(__dirname, '../../database/migrations');
        const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
        
        for (const migration of migrations) {
            await runSqlFile(client, path.join(migrationsDir, migration));
        }

        // Run seeds
        const seedsDir = path.join(__dirname, '../../database/seeds');
        const seeds = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
        
        for (const seed of seeds) {
            await runSqlFile(client, path.join(seedsDir, seed));
        }

        console.log('Database setup completed successfully.');
    } catch (err) {
        console.error('Error during database setup:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
