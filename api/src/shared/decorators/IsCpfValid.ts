import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCpfValidConstraint implements ValidatorConstraintInterface {
  private validationError: string = '';

  validate(cpf: string, args: ValidationArguments) {
    const result = this.isValidCpf(cpf);
    return result.isValid;
  }

  defaultMessage(args: ValidationArguments) {
    return this.validationError || 'Invalid CPF format';
  }

  private isValidCpf(cpf: string): { isValid: boolean; error?: string } {
    if (!cpf) {
      this.validationError = 'CPF is required';
      return { isValid: false };
    }

    const cleanCpf = cpf.replace(/[^\d]/g, '');

    const formattedCpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    if (!formattedCpfRegex.test(cpf)) {
      this.validationError = 'CPF must be in format 999.999.999-99 or contain only numbers';
      return { isValid: false };
    }

    if (cleanCpf.length !== 11) {
      this.validationError = `CPF must have exactly 11 digits, received ${cleanCpf.length}`;
      return { isValid: false };
    }

    if (/^(\d)\1+$/.test(cleanCpf)) {
      this.validationError = 'CPF cannot have all identical digits';
      return { isValid: false };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) {
      this.validationError = 'CPF has invalid check digits (first verification digit)';
      return { isValid: false };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) {
      this.validationError = 'CPF has invalid check digits (second verification digit)';
      return { isValid: false };
    }

    this.validationError = '';
    return { isValid: true };
  }
}

export function IsCpfValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfValidConstraint,
    });
  };
}
