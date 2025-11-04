const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('../utils/database');

class AuthService {
  // Generate 2FA secret and QR code
  async generate2FASecret(userId) {
    try {
      const secret = speakeasy.generateSecret({
        name: `MedTechAI (${userId})`,
        issuer: 'MedTechAI',
        length: 32
      });

      // Store secret temporarily in database
      await db.query(
        `UPDATE users SET two_factor_secret = $1, two_factor_enabled = false WHERE id = $2`,
        [secret.base32, userId]
      );

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntry: secret.base32
      };
    } catch (error) {
      console.error('2FA secret generation error:', error);
      throw new Error('Failed to generate 2FA secret');
    }
  }

  // Verify 2FA token
  async verify2FAToken(userId, token) {
    try {
      const user = await db.query(
        'SELECT two_factor_secret FROM users WHERE id = $1 AND two_factor_enabled = true',
        [userId]
      );

      if (user.rows.length === 0) {
        return { valid: false, error: '2FA not enabled' };
      }

      const verified = speakeasy.totp.verify({
        secret: user.rows[0].two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps (60 seconds) of tolerance
      });

      return { valid: verified };
    } catch (error) {
      console.error('2FA verification error:', error);
      return { valid: false, error: 'Verification failed' };
    }
  }

  // Enable 2FA after verification
  async enable2FA(userId, token) {
    try {
      const verification = await this.verify2FAToken(userId, token);
      
      if (!verification.valid) {
        return { success: false, error: 'Invalid token' };
      }

      await db.query(
        'UPDATE users SET two_factor_enabled = true WHERE id = $1',
        [userId]
      );

      return { success: true, message: '2FA enabled successfully' };
    } catch (error) {
      console.error('2FA enable error:', error);
      return { success: false, error: 'Failed to enable 2FA' };
    }
  }

  // Disable 2FA
  async disable2FA(userId, password) {
    try {
      // Verify password first
      const user = await db.findUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return { success: false, error: 'Invalid password' };
      }

      await db.query(
        'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1',
        [userId]
      );

      return { success: true, message: '2FA disabled successfully' };
    } catch (error) {
      console.error('2FA disable error:', error);
      return { success: false, error: 'Failed to disable 2FA' };
    }
  }

  // Get 2FA backup codes
  async generateBackupCodes(userId) {
    try {
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      // Store hashed backup codes
      const bcrypt = require('bcryptjs');
      const hashedCodes = await Promise.all(
        codes.map(code => bcrypt.hash(code, 10))
      );

      await db.query(
        'UPDATE users SET backup_codes = $1 WHERE id = $2',
        [JSON.stringify(hashedCodes), userId]
      );

      return { codes };
    } catch (error) {
      console.error('Backup code generation error:', error);
      throw new Error('Failed to generate backup codes');
    }
  }

  // Verify backup code
  async verifyBackupCode(userId, code) {
    try {
      const user = await db.query(
        'SELECT backup_codes FROM users WHERE id = $1',
        [userId]
      );

      if (user.rows.length === 0 || !user.rows[0].backup_codes) {
        return { valid: false };
      }

      const backupCodes = JSON.parse(user.rows[0].backup_codes);
      const bcrypt = require('bcryptjs');

      for (let i = 0; i < backupCodes.length; i++) {
        const isValid = await bcrypt.compare(code, backupCodes[i]);
        if (isValid) {
          // Remove used code
          backupCodes.splice(i, 1);
          await db.query(
            'UPDATE users SET backup_codes = $1 WHERE id = $2',
            [JSON.stringify(backupCodes), userId]
          );
          return { valid: true };
        }
      }

      return { valid: false };
    } catch (error) {
      console.error('Backup code verification error:', error);
      return { valid: false };
    }
  }
}

module.exports = new AuthService();

