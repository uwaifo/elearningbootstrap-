import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const ProjectSchema = new Schema({
    module: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
    },
    title: String,
    instructions: String,
    hints: String,
    due_date: Date,
    date_submitted: Date
}, { collection: 'projects' });
ProjectSchema.plugin(timestamps);
export default mongoose.model('Project', ProjectSchema);