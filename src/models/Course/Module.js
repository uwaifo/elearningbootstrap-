import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const ModuleSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    title: String,
    overview: String,
    objectives: String,
    guide: String,
    video_url: String,
    more_content: String,
    duration: {
        type: Number,
        default: 9
    },
    locked: {
        type: Boolean,
        default: true
    },
    week_no: {
        type: Number,
        default: 0
    },
    current_week: {
        type: Boolean,
        default: false
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    submission_link: String,
    materials: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Material',
    },
    group_link: String,
}, { collection: 'modules' });
ModuleSchema.plugin(timestamps);
export default mongoose.model('Module', ModuleSchema);