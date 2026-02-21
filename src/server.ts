import app from './app.js';
import { config } from './configs/env.config.js';
import { connectDB } from './configs/db.config.js';

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        const PORT = config.port;
        app.listen(PORT, () => {
            console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
