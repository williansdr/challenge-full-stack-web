import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function execute() {
  try {
    console.log('🗑️ Iniciando limpeza do banco de dados...');

    await prisma.user.deleteMany({});

    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"users"', 'id'), 1, false);`;

    console.log('✅ Limpeza concluída!');
  } catch (error) {
    console.log('❌ Erro durante a limpeza: ', error);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    try {
      await execute();
    } catch (e) {
      console.error(e);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  })();
}
