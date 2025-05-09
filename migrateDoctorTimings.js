// Migration script to fix doctor timings format
const mongoose = require('mongoose');
const moment = require('moment');
require('dotenv').config(); // Load environment variables

// Import your Doctor model
const { Doctor } = require('./models/models');

async function migrateDoctorTimings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Get all doctors
        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors to process`);
        
        let updatedCount = 0;
        
        // Process each doctor
        for (const doctor of doctors) {
            if (!doctor.timings) continue;
            
            const originalTimings = doctor.timings;
            let needsUpdate = false;
            let newTimings = { start: '', end: '' };
            
            // Check if timings is already in desired format (object with start and end as HH:MM strings)
            if (typeof originalTimings === 'object') {
                // Handle Array format (from TimePicker.RangePicker)
                if (Array.isArray(originalTimings) && originalTimings.length === 2) {
                    newTimings.start = moment(originalTimings[0]).format('HH:mm');
                    newTimings.end = moment(originalTimings[1]).format('HH:mm');
                    needsUpdate = true;
                }
                // Handle object with ISO string values
                else if (originalTimings.start && originalTimings.end) {
                    // Check if the values are ISO strings that need formatting
                    if (originalTimings.start.includes('T') || originalTimings.start.length > 5) {
                        newTimings.start = moment(originalTimings.start).format('HH:mm');
                        needsUpdate = true;
                    } else {
                        newTimings.start = originalTimings.start;
                    }
                    
                    if (originalTimings.end.includes('T') || originalTimings.end.length > 5) {
                        newTimings.end = moment(originalTimings.end).format('HH:mm');
                        needsUpdate = true;
                    } else {
                        newTimings.end = originalTimings.end;
                    }
                }
            }
            
            // If we need to update, save the new timings
            if (needsUpdate) {
                console.log(`Updating doctor: ${doctor.first_name} ${doctor.last_name}`);
                console.log(`Original timings:`, originalTimings);
                console.log(`New timings:`, newTimings);
                
                doctor.timings = newTimings;
                await doctor.save();
                updatedCount++;
            }
        }
        
        console.log(`Migration complete. Updated ${updatedCount} doctors.`);
    } catch (error) {
        console.error('Error in migration:', error);
    } finally {
        // Close MongoDB connection
        mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the migration
migrateDoctorTimings();