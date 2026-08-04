import prisma from '@/lib/prisma';

export class UserRepository {
  async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (error) {
      console.warn('[UserRepository] findByEmail DB error:', error?.message);
      return null;
    }
  }

  async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.warn('[UserRepository] findById DB error:', error?.message);
      return null;
    }
  }

  async create(data) {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async softDelete(id) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
