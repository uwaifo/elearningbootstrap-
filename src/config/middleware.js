import bodyParser from 'body-parser';
//import constants from './constants';
import { decodeToken } from '../services/auth';

//Getting jwt from user's request headers
export default async function auth(req, res, next) {
    try {
        //Making sure headers is not null or undefined
        const token = req.headers.authorization;
        //console.log(token);

        if (token != null) {
            //Passing the headers for validation and verification   
            const user = await decodeToken(token);
            return user;
        } else {
            return null;
        }
        //return next();
    } catch (error) {
        throw error
    }
}

/*export default app => {
    app.use(bodyParser.json());
    app.use(auth);
}*/