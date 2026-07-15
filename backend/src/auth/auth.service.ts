import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, roleName } = registerDto;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new BadRequestException('User email already registered');
    }

    let role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      const defaultPermissions = roleName === 'Super Admin'
        ? ['all']
        : ['read', 'write'];
      role = await this.prisma.role.create({
        data: {
          name: roleName,
          permissions: defaultPermissions,
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    return {
      message: 'Registration successful',
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshTokenValue = this.jwtService.sign(payload, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenValue,
        expiresAt,
      },
    });

    const sessionExpiresAt = new Date();
    sessionExpiresAt.setHours(sessionExpiresAt.getHours() + 2);
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        ipAddress,
        userAgent,
        expiresAt: sessionExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 7200,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
      sessionId: session.id,
    };
  }

  async logout(token: string) {
    await this.prisma.session.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const newPayload = { sub: payload.sub, email: payload.email, role: payload.role };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    await this.prisma.auditLog.create({
      data: {
        action: 'Forgot Password Request',
        actor: user.name,
        role: 'system',
        newVal: `Simulated Reset Token: ${resetToken}`,
      },
    });

    return {
      message: 'Password reset instructions sent (simulated). Token logged to Audit trail.',
      resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    const audit = await this.prisma.auditLog.findFirst({
      where: {
        action: 'Forgot Password Request',
        newVal: { contains: token },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!audit) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findFirst({
      where: { name: audit.actor },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: 'Password reset successful' };
  }
}
