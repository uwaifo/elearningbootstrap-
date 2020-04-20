import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const CompletedModules = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    projects: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Project',
        default: []
    },
    modules: {
        type: Array(Schema.Types.ObjectId),
        ref: 'Module',
        default: []
    },
    url: String
}, { collection: 'completed_modules' });
CompletedModules.plugin(timestamps);
export default mongoose.model('CompletedModule', CompletedModules);