import prisma from '@/lib/prisma';

export class AuthRepository {
  async createSession(data) {
    return prisma.session.create({ data });
  }

  async findSessionByToken(token) {
    return prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });
  }

  async deleteSession(token) {
    return prisma.session.delete({
      where: { sessionToken: token },
    });
  }
}

export const authRepository = new AuthRepository();
