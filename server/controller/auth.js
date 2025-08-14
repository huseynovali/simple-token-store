const authService = require("../service/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email or password is required",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      const result = await authService.login(email, password, res);

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
        message: "Server error",
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
          message: "Email, password, and name are required",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const result = await authService.register(email, password, name, res);

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
        message: "Server error",
        error: error.message,
      });
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data || null,
      ...(result.error && { error: result.error }),
    });
  },

  logout: async (req, res) => {
    try {
      const result = await authService.logout(res);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error("AuthController logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
