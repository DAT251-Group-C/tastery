import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { UserEntity } from '../../entities';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public getUserById(id: string): Observable<UserEntity> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map(user => {
        if (!user) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }

        return user;
      }),
    );
  }

  public updateUser(id: string, body: UpdateUserDto): Observable<UpdateResult> {
    return from(this.userRepository.update({ id }, body)).pipe(
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }
      }),
    );
  }

  public deleteUser(id: string): Observable<DeleteResult> {
    return from(this.userRepository.delete({ id })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`User with id ${id} not found`);
        }
      }),
    );
  }
}
