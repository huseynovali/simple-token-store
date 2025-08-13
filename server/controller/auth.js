const authService = require("../service/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email ve şifre zorunludur",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir email adresi giriniz",
        });
      }

      const result = await authService.login(email, password);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      console.error("AuthController login error:", error);
      return res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, şifre ve isim zorunludur",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir email adresi giriniz",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Şifre en az 6 karakter olmalıdır",
        });
      }

      const result = await authService.register(email, password, name);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data || null,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      console.error("AuthController register error:", error);
      return res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
