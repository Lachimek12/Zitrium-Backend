import mongoose from 'mongoose';

export function connectToMongoDB(mongo_uri: string) {
    mongoose.connect(mongo_uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error: Error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}