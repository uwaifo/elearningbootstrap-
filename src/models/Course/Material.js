import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const MaterialSchema = new Schema({
    module: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Module',
    },
    title: String,
    description: String,
    url: String
}, { collection: 'materials' });
MaterialSchema.plugin(timestamps);
export default mongoose.model('Material', MaterialSchema);