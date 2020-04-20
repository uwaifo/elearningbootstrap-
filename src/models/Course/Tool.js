import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const ToolSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    title: String,
    url: String
}, { collection: 'tools_needed' });
ToolSchema.plugin(timestamps);
export default mongoose.model('Tool', ToolSchema);