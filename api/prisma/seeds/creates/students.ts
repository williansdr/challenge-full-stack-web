import { PrismaClient, UserRole } from '@prisma/client';

const students = [
  {
    name: 'Ana Silva Santos',
    email: 'ana.silva@estudante.com',
    cpf: '533.258.580-23',
    ra: 'RA2025001',
    role: UserRole.STUDENT,
  },
  {
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@estudante.com',
    cpf: '922.962.034-34',
    ra: 'RA2025002',
    role: UserRole.STUDENT,
  },
  {
    name: 'Maria Fernanda Costa',
    email: 'maria.costa@estudante.com',
    cpf: '846.682.812-55',
    ra: 'RA2025003',
    role: UserRole.STUDENT,
  },
  {
    name: 'João Pedro Oliveira',
    email: 'joao.oliveira@estudante.com',
    cpf: '199.263.598-68',
    ra: 'RA2025004',
    role: UserRole.STUDENT,
  },
  {
    name: 'Beatriz Almeida Rocha',
    email: 'beatriz.rocha@estudante.com',
    cpf: '323.308.397-15',
    ra: 'RA2025005',
    role: UserRole.STUDENT,
  },
  {
    name: 'Lucas Gabriel Torres',
    email: 'lucas.torres@estudante.com',
    cpf: '791.355.003-10',
    ra: 'RA2025006',
    role: UserRole.STUDENT,
  },
  {
    name: 'Camila Rodrigues Souza',
    email: 'camila.souza@estudante.com',
    cpf: '159.864.542-00',
    ra: 'RA2025007',
    role: UserRole.STUDENT,
  },
  {
    name: 'Rafael Henrique Santos',
    email: 'rafael.santos@estudante.com',
    cpf: '195.297.354-64',
    ra: 'RA2025008',
    role: UserRole.STUDENT,
  },
  {
    name: 'Júlia Martins Pereira',
    email: 'julia.pereira@estudante.com',
    cpf: '082.060.635-95',
    ra: 'RA2025009',
    role: UserRole.STUDENT,
  },
  {
    name: 'Bruno César Ferreira',
    email: 'bruno.ferreira@estudante.com',
    cpf: '329.581.819-36',
    ra: 'RA2025010',
    role: UserRole.STUDENT,
  },
  {
    name: 'Larissa Campos Nascimento',
    email: 'larissa.nascimento@estudante.com',
    cpf: '119.277.578-35',
    ra: 'RA2025011',
    role: UserRole.STUDENT,
  },
  {
    name: 'Diego Alessandro Silva',
    email: 'diego.silva@estudante.com',
    cpf: '552.995.276-32',
    ra: 'RA2025012',
    role: UserRole.STUDENT,
  },
  {
    name: 'Isabela Gonçalves Lima',
    email: 'isabela.lima@estudante.com',
    cpf: '215.178.576-94',
    ra: 'RA2025013',
    role: UserRole.STUDENT,
  },
  {
    name: 'Thiago Barbosa Costa',
    email: 'thiago.costa@estudante.com',
    cpf: '271.102.818-68',
    ra: 'RA2025014',
    role: UserRole.STUDENT,
  },
  {
    name: 'Amanda Cristina Santos',
    email: 'amanda.santos@estudante.com',
    cpf: '612.815.773-40',
    ra: 'RA2025015',
    role: UserRole.STUDENT,
  },
];

export async function createStudents(prisma: PrismaClient) {
  console.log('🎓 Criando estudantes...');

  await prisma.$transaction(async transaction => {
    for (const student of students) {
      const found = await transaction.user.findUnique({
        where: { email: student.email },
      });

      if (!found) {
        const createdStudent = await transaction.user.create({
          data: student,
        });

        console.log(`✅ Estudante criado: ${createdStudent.name} (${createdStudent.ra})`);
      } else {
        console.log(`⚠️ Estudante já existe: ${student.name} (${student.ra})`);
      }
    }
  });

  return true;
}
