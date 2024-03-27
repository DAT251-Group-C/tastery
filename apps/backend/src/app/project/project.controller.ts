import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
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
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(ProjectEntity) } } })
  public getProjects(@AccessToken() accessToken: IAccessToken): Promise<ProjectEntity[]> {
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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateProjectDto })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(ProjectEntity) } })
  public createProject(
    @AccessToken() accessToken: IAccessToken,
    @Query('organizationId') organizationId: string,
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
}
