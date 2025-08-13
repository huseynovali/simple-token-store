const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authService = {
  login: async (email, password) => {
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

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET || "default_secret_key",
        { expiresIn: "24h" }
      );

      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: "Giriş başarılı",
        statusCode: 200,
        data: {
          user: userWithoutPassword,
          token: token,
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

  register: async (email, password, name) => {
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

      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        process.env.JWT_SECRET || "default_secret_key",
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Kayıt başarılı",
        statusCode: 201,
        data: {
          user: newUser,
          token: token,
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
};

module.exports = authService;
