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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AccessToken, IAccessToken } from '../../common/decorators/access-token.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationEntity } from '../../models';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('Organizations')
@Controller('organizations')
@UseInterceptors(ClassSerializerInterceptor)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(OrganizationEntity) } } })
  public getOrganizations(@AccessToken() accessToken: IAccessToken): Promise<OrganizationEntity[]> {
    return lastValueFrom(
      this.organizationService.getOrganizations(accessToken.sub).pipe(
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

  @Get(':organizationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiOkResponse({ type: OrganizationEntity })
  public getOrganizationById(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
  ): Promise<OrganizationEntity> {
    return lastValueFrom(
      this.organizationService.getOrganizationById(organizationId, accessToken.sub).pipe(
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
  @ApiBody({ type: CreateOrganizationDto })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(OrganizationEntity) } })
  public createOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationEntity> {
    return lastValueFrom(
      this.organizationService.createOrganization(createOrganizationDto, accessToken.sub).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Put(':organizationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiBody({ type: UpdateOrganizationDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<UpdateResult> {
    return lastValueFrom(
      this.organizationService.updateOrganization(organizationId, accessToken.sub, updateOrganizationDto).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }

  @Delete(':organizationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.organizationService.deleteOrganization(organizationId, accessToken.sub).pipe(
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
        take(1),
      ),
    );
  }
}
