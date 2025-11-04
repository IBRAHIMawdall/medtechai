const authService = require('../../services/authService');
const db = require('../../utils/database');

jest.mock('../../utils/database');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generate2FASecret', () => {
    it('should generate 2FA secret for user', async () => {
      const userId = 'test-user-id';
      
      db.query.mockResolvedValue({ rowCount: 1 });

      const result = await authService.generate2FASecret(userId);

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCode');
      expect(result).toHaveProperty('manualEntry');
      expect(db.query).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const userId = 'test-user-id';
      
      db.query.mockRejectedValue(new Error('Database error'));

      await expect(authService.generate2FASecret(userId))
        .rejects.toThrow('Failed to generate 2FA secret');
    });
  });

  describe('verify2FAToken', () => {
    it('should return false if user not found', async () => {
      const userId = 'test-user-id';
      const token = '123456';
      
      db.query.mockResolvedValue({ rows: [] });

      const result = await authService.verify2FAToken(userId, token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('2FA not enabled');
    });

    it('should verify valid 2FA token', async () => {
      const userId = 'test-user-id';
      const token = '123456';
      
      db.query.mockResolvedValue({
        rows: [{ two_factor_secret: 'test-secret' }]
      });

      const result = await authService.verify2FAToken(userId, token);

      expect(result).toHaveProperty('valid');
    });
  });

  describe('disable2FA', () => {
    it('should return false if user not found', async () => {
      db.findUserById = jest.fn().mockResolvedValue(null);

      const result = await authService.disable2FA('test-user-id', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });
});

