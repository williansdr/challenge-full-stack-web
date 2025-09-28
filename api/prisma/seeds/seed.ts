import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import { createAdmins, createStudents } from './creates';

const prisma = new PrismaClient();

const execute = async () => {
  console.log('🌱 Iniciando os seeds...');
  try {
    await createAdmins(prisma);
    await createStudents(prisma);

    console.log('🎉 Seeds executados com sucesso!');
  } catch (error) {
    console.log('❌ Erro ao tentar executar os seeds: ', error);
  } finally {
    await prisma.$disconnect();
  }
};

execute();
