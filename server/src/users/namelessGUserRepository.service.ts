import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NamelessGUserEntity } from './models/namelessGUser.entity';
import { NamelessGUser } from './models/namelessGUser.interface';
@Injectable()
export class NamelessGUserRepositoryService {
  constructor(
    @InjectRepository(NamelessGUserEntity)
    private readonly namelessGUserRepository: Repository<NamelessGUser>,
  ) {}

  public async create(email: string, googleID: string): Promise<NamelessGUser> {
    const newUser = new NamelessGUserEntity();
    newUser.email = email;
    newUser.googleID = googleID;
    return this.namelessGUserRepository.save(newUser);
  }

  public async deleteOneByEmail(email: string) {
    return this.namelessGUserRepository.delete({ email });
  }

  public async findOneByEmail(email: string): Promise<NamelessGUser> {
    return this.namelessGUserRepository.findOne({ email });
  }
}
