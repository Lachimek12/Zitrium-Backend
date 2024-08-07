import { IUser } from '@models/user.model';
import { JWT_SECRET_KEY } from '@utils/constants';
import passport from 'passport';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('@models/user.model');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY,
};

passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            const user: IUser = await UserModel.findOne({ email: jwt_payload.email });

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }

        } catch (err) {
            return done(err, false);
        }
    })
);