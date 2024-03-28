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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, switchMap, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
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
  @ApiQuery({ type: PageOptionsDto, required: false })
  @ApiOkResponsePaginated(Project)
  public getProjects(@UserId() userId: string, @Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Project>> {
    return lastValueFrom(
      this.projectService.getProjects(userId, pageOptionsDto).pipe(
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
  @ApiParam({ name: 'organizationId', required: true })
  @ApiQuery({ type: PageOptionsDto, required: false })
  @ApiOkResponsePaginated(Project)
  public getProjectsInOrganization(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Project>> {
    return lastValueFrom(
      this.projectService.getProjectsInOrganization(organizationId, userId, pageOptionsDto).pipe(
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
  @ApiOkResponse({ type: FullProject })
  public getProjectById(@UserId() userId: string, @Param('projectId', ParseUUIDPipe) projectId: string): Promise<FullProject> {
    return lastValueFrom(
      this.projectService.getProjectById(projectId, userId).pipe(
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
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.ADMIN, MembershipRole.OWNER])
  @ApiParam({ name: 'organizationId' })
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({ type: Project })
  public createProject(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() body: CreateProjectDto,
  ): Promise<Project> {
    return lastValueFrom(
      this.projectService.createProject(body, organizationId, userId).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch('organizations/:organizationId/projects/:projectId')
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', required: true })
  @ApiBody({ type: CreateProjectDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateProject(
    @UserId() userId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateProjectDto,
  ): Promise<UpdateResult> {
    return lastValueFrom(
      this.projectService.updateProject(projectId, userId, body).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Delete('organizations/:organizationId/projects/:projectId')
  @ApiBearerAuth()
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.ADMIN, MembershipRole.OWNER])
  @ApiParam({ name: 'projectId', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteProject(@UserId() userId: string, @Param('projectId', ParseUUIDPipe) projectId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.projectService.deleteProject(projectId, userId).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
