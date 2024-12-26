import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import User from '../models/User.js';

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user exists
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           // Create new user
//           user = await User.create({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             isVerified: true,
//           });
//         }
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// // Serialize user for sessions
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user from sessions
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
