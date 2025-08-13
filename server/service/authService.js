const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authService = {
  login: async (email, password, res) => {
    try {
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: "Kullanıcı bulunamadı",
          statusCode: 404,
        };
      }

      const user = userResult.rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Geçersiz şifre",
          statusCode: 401,
        };
      }

      const accessToken = authService.createAccessToken(user.id);
      const refreshToken = authService.createRefreshToken(user.id);

      if (res) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Development için false
          sameSite: "lax", // Cross-origin için lax
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
          path: '/' // Cookie path'i belirt
        });
      }

      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: "Giriş başarılı",
        statusCode: 200,
        data: {
          user: userWithoutPassword,
          accessToken: accessToken,
        },
      };
    } catch (error) {
      console.error("AuthService login error:", error);
      return {
        success: false,
        message: "Sunucu hatası",
        statusCode: 500,
        error: error.message,
      };
    }
  },

  register: async (email, password, name, res) => {
    try {
      const existingUserQuery = "SELECT id FROM users WHERE email = $1";
      const existingUser = await pool.query(existingUserQuery, [email]);

      if (existingUser.rows.length > 0) {
        return {
          success: false,
          message: "Bu email zaten kayıtlı",
          statusCode: 409,
        };
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const insertUserQuery = `
                INSERT INTO users (email, password, name, created_at) 
                VALUES ($1, $2, $3, NOW()) 
                RETURNING id, email, name, created_at
            `;
      const newUserResult = await pool.query(insertUserQuery, [
        email,
        hashedPassword,
        name,
      ]);
      const newUser = newUserResult.rows[0];

      const accessToken = authService.createAccessToken(newUser.id);
      const refreshToken = authService.createRefreshToken(newUser.id);

      // Refresh token'ı httpOnly cookie olarak ayarla
      if (res) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Development için false
          sameSite: "lax", // Cross-origin için lax
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
          path: '/' // Cookie path'i belirt
        });
      }

      return {
        success: true,
        message: "Kayıt başarılı",
        statusCode: 201,
        data: {
          user: newUser,
          accessToken: accessToken,
        },
      };
    } catch (error) {
      console.error("AuthService register error:", error);
      return {
        success: false,
        message: "Sunucu hatası",
        statusCode: 500,
        error: error.message,
      };
    }
  },

  refreshAccessToken: async (refreshToken, res) => {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET || "default_secret_key"
      );

      const userQuery = "SELECT id, email, name FROM users WHERE id = $1";
      const userResult = await pool.query(userQuery, [decoded.userId]);

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: "Kullanıcı bulunamadı",
          statusCode: 404,
        };
      }

      const user = userResult.rows[0];
      const newAccessToken = authService.createAccessToken(user.id);
      const newRefreshToken = authService.createRefreshToken(user.id);

      if (res) {
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false, // Development için false
          sameSite: "lax", // Cross-origin için lax
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
          path: '/' // Cookie path'i belirt
        });
      }

      return {
        success: true,
        message: "Token yenilendi",
        statusCode: 200,
        data: {
          accessToken: newAccessToken,
          user: user,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Geçersiz refresh token",
        statusCode: 401,
        error: error.message,
      };
    }
  },

  logout: async (res) => {
    try {
      // Refresh token cookie'sini temizle
      if (res) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false, // Development için false
          sameSite: "lax", // Cross-origin için lax
          path: '/' // Cookie path'i belirt
        });
      }

      return {
        success: true,
        message: "Çıkış başarılı",
        statusCode: 200,
      };
    } catch (error) {
      return {
        success: false,
        message: "Çıkış hatası",
        statusCode: 500,
        error: error.message,
      };
    }
  },

  createAccessToken: (userId) => {
    return jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "3h" }
    );
  },
  createRefreshToken: (userId) => {
    return jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );
  },
};

module.exports = authService;
