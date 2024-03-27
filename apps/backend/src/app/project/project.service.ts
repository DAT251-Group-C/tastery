import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, catchError, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { ProjectEntity } from '../../models';
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

  public getProjects(userId: string): Observable<ProjectEntity[]> {
    return from(
      this.projectRepository
        .createQueryBuilder('project')
        .innerJoin('project.organization', 'organization')
        .innerJoin('organization.memberships', 'membership')
        .where('membership.userId = :userId', { userId })
        .getMany(),
    );
  }

  public getProjectsInOrganization(organizationId: string, userId: string): Observable<ProjectEntity[]> {
    return this.organizationService
      .userHasAccessToOrganization(organizationId, userId)
      .pipe(switchMap(({ id }) => this.projectRepository.findBy({ organizationId: id })));
  }

  public getProjectById(projectId: string, userId: string): Observable<ProjectEntity> {
    return this.userHasAccessToProject(projectId, userId);
  }

  public updateProject(projectId: string, userId: string, body: UpdateProjectDto): Observable<UpdateResult> {
    return this.userHasAccessToProject(projectId, userId).pipe(
      switchMap(({ id }) => this.projectRepository.update({ id }, body)),
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }
      }),
    );
  }

  public deleteProject(projectId: string, userId: string): Observable<DeleteResult> {
    return this.userHasAccessToProject(projectId, userId).pipe(
      switchMap(({ id }) => this.projectRepository.delete({ id })),
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }
      }),
    );
  }

  public userHasAccessToProject(projectId: string, userId: string): Observable<ProjectEntity> {
    return from(this.projectRepository.findOneBy({ id: projectId })).pipe(
      map(project => {
        if (!project) {
          throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
        }

        return project;
      }),
      tap(({ organizationId }) => this.organizationService.userHasAccessToOrganization(organizationId, userId)),
      catchError(() => {
        throw new ResourceNotFoundException(`Project with id ${projectId} not found`);
      }),
    );
  }
}