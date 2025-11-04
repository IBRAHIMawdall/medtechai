const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../utils/database');

// Google OAuth 2.0 Strategy (only if credentials provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with this Google ID
    const existingUser = await db.query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    if (existingUser.rows.length > 0) {
      return done(null, existingUser.rows[0]);
    }

    // Check if user exists with this email
    const emailCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [profile.emails[0].value]
    );

    if (emailCheck.rows.length > 0) {
      // Link Google account to existing user
      await db.query(
        'UPDATE users SET google_id = $1 WHERE email = $2',
        [profile.id, profile.emails[0].value]
      );
      
      const updatedUser = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );
      
      return done(null, updatedUser.rows[0]);
    }

    // Create new user from Google profile
    const bcrypt = require('bcryptjs');
    const randomPassword = Math.random().toString(36).slice(-12);
    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const newUser = await db.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, google_id, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, 'patient', true)
       RETURNING *`,
      [
        profile.emails[0].value.split('@')[0],
        profile.emails[0].value,
        passwordHash,
        profile.name.givenName,
        profile.name.familyName,
        profile.id
      ]
    );

    return done(null, newUser.rows[0]);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
  }));
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

