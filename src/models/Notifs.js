import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const NotifsSchema = new Schema({
    course: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Course',
        default: []
    },
    title: String,
    description: String,
    type: String,
    url: String,
    date: Date
}, { collection: 'notifications' });
NotifsSchema.plugin(timestamps);
export default mongoose.model('Notifs', NotifsSchema);