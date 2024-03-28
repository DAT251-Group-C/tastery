import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, switchMap, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AccessToken, IAccessToken } from '../../common/decorators/access-token.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { FullProject, Project } from '../../common/models';
import { MembershipRole } from '../../entities/membership.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('projects')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(Project) } } })
  public getProjects(@AccessToken() accessToken: IAccessToken): Promise<Project[]> {
    return lastValueFrom(
      this.projectService.getProjects(accessToken.sub).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get('organizations/:organizationId/projects')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'organizationId', required: true })
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(Project) } } })
  public getProjectsInOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<Project[]> {
    return lastValueFrom(
      this.projectService.getProjectsInOrganization(organizationId, accessToken.sub).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get('projects/:projectId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(FullProject) } })
  public getProjectById(
    @AccessToken() accessToken: IAccessToken,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<FullProject> {
    return lastValueFrom(
      this.projectService.getProjectById(projectId, accessToken.sub).pipe(
        take(1),
        switchMap(async project => ({
          ...project,
          organization: await project.organization,
          credentials: await project.credentials,
          tools: await project.tools,
        })),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Post('organizations/:organizationId/projects')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.ADMIN, MembershipRole.OWNER])
  @ApiParam({ name: 'organizationId' })
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(FullProject) } })
  public createProject(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<FullProject> {
    return lastValueFrom(
      this.projectService.createProject(createProjectDto, organizationId, accessToken.sub).pipe(
        take(1),
        switchMap(async project => ({
          ...project,
          organization: await project.organization,
          credentials: await project.credentials,
          tools: await project.tools,
        })),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch('organizations/:organizationId/projects/:projectId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'projectId', required: true })
  @ApiBody({ type: CreateProjectDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateProject(
    @AccessToken() accessToken: IAccessToken,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<UpdateResult> {
    return lastValueFrom(
      this.projectService.updateProject(projectId, accessToken.sub, createProjectDto).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Delete('organizations/:organizationId/projects/:projectId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.ADMIN, MembershipRole.OWNER])
  @ApiParam({ name: 'projectId', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteProject(
    @AccessToken() accessToken: IAccessToken,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.projectService.deleteProject(projectId, accessToken.sub).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
