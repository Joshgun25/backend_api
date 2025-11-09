// User model
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role || "user";
    this.isVerified = data.isVerified || false;
    this.twoFactorEnabled = data.twoFactorEnabled || false;
    this.kycStatus = data.kycStatus || "pending";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Remove sensitive data before sending to client
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      isVerified: this.isVerified,
      twoFactorEnabled: this.twoFactorEnabled,
      kycStatus: this.kycStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Validate user data
  static validate(data) {
    const errors = [];

    if (!data.email || !data.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (!data.password || data.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// User data storage (will be replaced with database)
const users = [];

// User service methods
class UserService {
  static findById(id) {
    return users.find((user) => user.id === parseInt(id));
  }

  static findByEmail(email) {
    return users.find((user) => user.email === email);
  }

  static create(userData) {
    const validation = User.validate(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const newUser = new User({
      id: users.length + 1,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    users.push(newUser);
    return newUser;
  }

  static update(id, updateData) {
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return users[userIndex];
  }

  static delete(id) {
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    return users.splice(userIndex, 1)[0];
  }

  static getAll() {
    return users.map((user) => user.toJSON());
  }
}

module.exports = {
  User,
  users,
  UserService
};
