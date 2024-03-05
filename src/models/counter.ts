// counter.model.ts or wherever you define your Mongoose models
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: String, // typically the name of the collection for which the counter is used
    seq: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('counter', counterSchema);
