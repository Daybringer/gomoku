import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { UserEntity } from '../models/user.entity';

const userRepository = getRepository(UserEntity);

@ValidatorConstraint({ async: true })
export class UsernameExistsConstraint implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    return userRepository.findOne(userName).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function UsernameExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsernameExistsConstraint,
    });
  };
}
