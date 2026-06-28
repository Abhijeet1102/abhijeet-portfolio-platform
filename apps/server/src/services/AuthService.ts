import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-for-dev-only';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: any) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // If it's the first user, make them SUPER_ADMIN
    const totalUsers = await this.userRepository.find();
    const role = totalUsers.length === 0 ? UserRole.SUPER_ADMIN : UserRole.VIEWER;

    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      role,
    });

    return this.generateAuthTokens(user);
  }

  async login(data: any) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('User account is disabled');
    }

    await this.userRepository.update(user._id.toString(), { lastLogin: new Date() });

    return this.generateAuthTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const user = await this.userRepository.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token or inactive user');
      }

      return this.generateAuthTokens(user);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  private generateAuthTokens(user: any) {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        forcePasswordChange: user.forcePasswordChange,
      },
      accessToken,
      refreshToken,
    };
  }

  async changePassword(userId: string, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(data.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Incorrect old password');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.newPassword, salt);

    await this.userRepository.update(userId, {
      passwordHash,
      forcePasswordChange: false,
    });

    return { message: 'Password changed successfully' };
  }
}
