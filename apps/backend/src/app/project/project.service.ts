import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { ProjectEntity } from '../../entities';
import { OrganizationService } from '../organization/organization.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly organizationService: OrganizationService,
  ) {}

  public createProject(body: CreateProjectDto, organizationId: string, userId: string): Observable<ProjectEntity> {
    return this.organizationService
      .userHasAccessToOrganization(organizationId, userId)
      .pipe(switchMap(({ id }) => this.projectRepository.save(this.projectRepository.create({ ...body, organizationId: id }))));
  }

  public getProjects(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<ProjectEntity>> {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.organization', 'organization')
      .innerJoin('organization.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .orderBy('project.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, projects]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(projects, pageMetaDto);
      }),
    );
  }

  public getProjectsInOrganization(
    organizationId: string,
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Observable<PageDto<ProjectEntity>> {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.organization', 'organization')
      .innerJoin('organization.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .andWhere('organization.id = :organizationId', { organizationId })
      .orderBy('project.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, projects]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(projects, pageMetaDto);
      }),
    );
  }

  public getProjectById(projectId: string, userId: string): Observable<ProjectEntity> {
    return from(
      this.projectRepository
        .createQueryBuilder('project')
        .innerJoin('project.organization', 'organization')
        .innerJoin('organization.memberships', 'membership')
        .where('membership.userId = :userId', { userId })
        .andWhere('project.id = :projectId', { projectId })
        .getOne(),
    ).pipe(
      map(project => {
        if (!project) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }

        return project;
      }),
    );
  }

  public updateProject(projectId: string, userId: string, body: UpdateProjectDto): Observable<UpdateResult> {
    return this.getProjectById(projectId, userId).pipe(
      switchMap(({ id }) => this.projectRepository.update({ id }, body)),
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }
      }),
    );
  }

  public deleteProject(projectId: string, userId: string): Observable<DeleteResult> {
    return this.getProjectById(projectId, userId).pipe(
      switchMap(({ id }) => this.projectRepository.delete({ id })),
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }
      }),
    );
  }
}
