import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const CourseSchema = new Schema({
    users: {
        type: Array(Schema.Types.ObjectId),
        ref: 'User',
        default: []
    },
    title: String,
    description: String,
    duration: {
        type: Number,
        default: 0
    },
    modules: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Module',
        default: []
    },
    tools_needed: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Tool',
        default: []
    },
    group_link: String,
    curriculum: String
}, { collection: 'courses' });
CourseSchema.plugin(timestamps);
export default mongoose.model('Course', CourseSchema);