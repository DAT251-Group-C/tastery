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
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AccessToken, IAccessToken } from '../../common/decorators/access-token.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ProjectEntity } from '../../models';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';

@ApiTags('Projects')
@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'If provided, will only return projects within specified organization',
  })
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(ProjectEntity) } } })
  public getProjects(
    @AccessToken() accessToken: IAccessToken,
    @Query('organizationId', ParseUUIDPipe) organizationId?: string,
  ): Promise<ProjectEntity[]> {
    const func = organizationId
      ? this.projectService.getProjectsInOrganization(organizationId, accessToken.sub)
      : this.projectService.getProjects(accessToken.sub);

    return lastValueFrom(
      func.pipe(
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

  @Get(':projectId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { $ref: getSchemaPath(ProjectEntity) } })
  public getProjectById(
    @AccessToken() accessToken: IAccessToken,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectEntity> {
    return lastValueFrom(
      this.projectService.getProjectById(projectId, accessToken.sub).pipe(
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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(ProjectEntity) } })
  public createProject(
    @AccessToken() accessToken: IAccessToken,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    return lastValueFrom(
      this.projectService.createProject(createProjectDto, organizationId, accessToken.sub).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Put(':projectId')
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

  @Delete(':projectId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
