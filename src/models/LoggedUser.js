import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const LoggedUser = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
    },
    completed_modules: {
        type: Array(Schema.Types.ObjectId),
        ref: 'CompletedModule',
        default: []
    },
    current_week: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
    }
}, { collection: 'logged_users' });
LoggedUser.plugin(timestamps);
export default mongoose.model('LoggedUser', LoggedUser);