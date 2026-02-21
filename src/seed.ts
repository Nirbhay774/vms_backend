import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './configs/env.config.js';
import { User } from './modules/auth/auth.model.js';
import { Vendor } from './modules/vendor/vendor.model.js';
import { Payout } from './modules/payout/payout.model.js';
import { UserRole, PayoutStatus } from './constants/index.js';
import { setServers } from 'node:dns/promises';

// Fix DNS for Atlas on restricted networks
setServers(['1.1.1.1', '8.8.8.8']);

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Vendor.deleteMany({}),
            Payout.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // ─── Users ──────────────────────────────────────────────
        const salt = await bcrypt.genSalt(10);

        const users = await User.insertMany([
            {
                name: 'Ops User',
                email: 'ops@demo.com',
                password: await bcrypt.hash('ops123', salt),
                role: UserRole.OPS,
                isActive: true,
            },
            {
                name: 'Finance User',
                email: 'finance@demo.com',
                password: await bcrypt.hash('fin123', salt),
                role: UserRole.FINANCE,
                isActive: true,
            },
        ]);

        const opsUser = users[0];
        const financeUser = users[1];
        console.log('👤 Inserted 2 users (ops@demo.com, finance@demo.com)');

        // ─── Vendors ────────────────────────────────────────────
        const vendors = await Vendor.insertMany([
            {
                name: 'Acme Corp',
                email: 'billing@acme.com',
                bankDetails: {
                    accountName: 'Acme Corporation',
                    accountNumber: '1234567890',
                    bankName: 'HDFC Bank',
                    ifscCode: 'HDFC0001234',
                },
                taxId: 'ACME12345',
                status: 'ACTIVE',
                createdBy: opsUser._id,
            },
            {
                name: 'Global Supplies Ltd',
                email: 'accounts@globalsupplies.com',
                bankDetails: {
                    accountName: 'Global Supplies Ltd',
                    accountNumber: '9876543210',
                    bankName: 'ICICI Bank',
                    ifscCode: 'ICIC0005678',
                },
                taxId: 'GLOB67890',
                status: 'ACTIVE',
                createdBy: opsUser._id,
            },
            {
                name: 'QuickFix Services',
                email: 'finance@quickfix.io',
                bankDetails: {
                    accountName: 'QuickFix Services Pvt Ltd',
                    accountNumber: '5555666677',
                    bankName: 'SBI',
                    ifscCode: 'SBIN0009999',
                },
                taxId: 'QFIX11223',
                status: 'ACTIVE',
                createdBy: financeUser._id,
            },
        ]);
        console.log('🏢 Inserted 3 vendors');

        // ─── Payouts ────────────────────────────────────────────
        await Payout.insertMany([
            {
                vendor: vendors[0]._id,
                amount: 15000,
                currency: 'USD',
                status: PayoutStatus.DRAFT,
                description: 'Monthly maintenance fee - Acme Corp',
                createdBy: opsUser._id,
            },
            {
                vendor: vendors[1]._id,
                amount: 42500,
                currency: 'USD',
                status: PayoutStatus.SUBMITTED,
                description: 'Q1 supply shipment - Global Supplies',
                createdBy: financeUser._id,
            },
            {
                vendor: vendors[2]._id,
                amount: 8750,
                currency: 'USD',
                status: PayoutStatus.APPROVED,
                description: 'Emergency repair work - QuickFix',
                createdBy: financeUser._id,
                approvedBy: financeUser._id,
            },
        ]);
        console.log('💰 Inserted 3 payouts (Draft, Submitted, Approved)');

        console.log('\n🎉 Seed completed successfully!');
        console.log('─────────────────────────────────');
        console.log('  ops@demo.com     / ops123   (OPS)');
        console.log('  finance@demo.com / fin123   (FINANCE)');
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
