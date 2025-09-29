export function formatCpf(cpf: string): string {
  const cleanCpf = cpf.replace(/[^\d]/g, '');
  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function cleanCpf(cpf: string): string {
  if (!cpf) return cpf;

  return cpf.replace(/[^\d]/g, '');
}
