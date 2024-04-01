import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { CredentialEntity } from '../../entities';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(CredentialEntity)
    private readonly credentialRepository: Repository<CredentialEntity>,
  ) {}

  public getCredentials(projectId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<CredentialEntity>> {
    const query = this.credentialRepository
      .createQueryBuilder('credential')
      .innerJoin('credential.project', 'project')
      .where('project.id = :projectId', { projectId })
      .orderBy('credential.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, credentials]) => {
        return new PageDto(credentials, new PageMetaDto({ itemCount, pageOptionsDto }));
      }),
    );
  }

  public createCredential(projectId: string, body: CreateCredentialDto): Observable<CredentialEntity> {
    const credential = this.credentialRepository.create({ projectId, ...body });
    return from(this.credentialRepository.save(credential));
  }

  public updateCredential(credentialId: string, body: UpdateCredentialDto): Observable<UpdateResult> {
    return from(this.credentialRepository.update({ id: credentialId }, body)).pipe(
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Credential with id ${credentialId} not found`);
        }
      }),
    );
  }

  public deleteCredential(credentialId: string): Observable<DeleteResult> {
    return from(this.credentialRepository.delete({ id: credentialId })).pipe(
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Credential with id ${credentialId} not found`);
        }
      }),
    );
  }
}
