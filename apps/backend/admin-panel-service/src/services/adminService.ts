import { PrismaClient } from '../../prisma/generated/client';

export type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

export interface Admin {
  id: string;
  email: string;
  name?: string | null;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdminData {
  email: string;
  password: string;
  name?: string;
  role?: AdminRole;
}

export interface UpdateAdminData {
  email?: string;
  password?: string;
  name?: string;
  role?: AdminRole;
  isActive?: boolean;
}

class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin as Admin | null;
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin as Admin | null;
  }

  async createAdmin(data: CreateAdminData): Promise<Admin> {
    const admin = await this.prisma.admin.create({
      data: {
        email: data.email,
        password: data.password, // В реальном проекте нужно хешировать пароль
        name: data.name,
        role: data.role || 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin as Admin;
  }

  async updateAdmin(id: string, data: UpdateAdminData): Promise<Admin | null> {
    try {
      const admin = await this.prisma.admin.update({
        where: { id },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.password && { password: data.password }), // В реальном проекте нужно хешировать пароль
          ...(data.name !== undefined && { name: data.name }),
          ...(data.role && { role: data.role }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return admin as Admin;
    } catch (error) {
      return null;
    }
  }

  async deleteAdmin(id: string): Promise<boolean> {
    try {
      await this.prisma.admin.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllAdmins(): Promise<Admin[]> {
    const admins = await this.prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return admins as Admin[];
  }

  async verifyPassword(email: string, password: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email, isActive: true },
    });

    if (!admin || admin.password !== password) {
      return null;
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as AdminRole,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const adminService = new AdminService(); 