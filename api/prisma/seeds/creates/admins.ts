import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const admins = [
  {
    name: 'Admin User',
    email: 'admin@maisaeducacao.com.br',
    cpf: '123.456.789-00',
    password: '12345678',
    role: UserRole.ADMIN,
  },
  {
    name: 'Super Administrator',
    email: 'superadmin@maisaeducacao.com.br',
    cpf: '987.654.321-00',
    password: '12345678',
    role: UserRole.ADMIN,
  },
];

export async function createAdmins(prisma: PrismaClient) {
  console.log('👨‍💼 Criando usuários administradores...');

  await prisma.$transaction(async transaction => {
    for (const admin of admins) {
      const found = await transaction.user.findUnique({
        where: { email: admin.email },
      });

      if (!found) {
        const hashedPassword = await hash(admin.password, 12);

        const createdAdmin = await transaction.user.create({
          data: {
            ...admin,
            password: hashedPassword,
          },
        });

        console.log(`✅ Admin criado: ${createdAdmin.name} (${createdAdmin.email})`);
      } else {
        console.log(`⚠️ Admin já existe: ${admin.name} (${admin.email})`);
      }
    }
  });

  return true;
}
