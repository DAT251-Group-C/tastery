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
import { FullOrganization, Organization } from '../../common/models';
import { MembershipRole } from '../../entities/membership.entity';
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
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(Organization) } } })
  public getOrganizations(@AccessToken() accessToken: IAccessToken): Promise<Organization[]> {
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
  @ApiOkResponse({ type: FullOrganization })
  public getOrganizationById(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
  ): Promise<FullOrganization> {
    return lastValueFrom(
      this.organizationService.getOrganizationById(organizationId, accessToken.sub).pipe(
        take(1),
        switchMap(async organization => ({
          ...organization,
          projects: await organization.projects,
          memberships: await organization.memberships,
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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateOrganizationDto })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(FullOrganization) } })
  public createOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<FullOrganization> {
    return lastValueFrom(
      this.organizationService.createOrganization(createOrganizationDto, accessToken.sub).pipe(
        take(1),
        switchMap(async organization => ({
          ...organization,
          projects: await organization.projects,
          memberships: await organization.memberships,
        })),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch(':organizationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
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

  @Delete(':organizationId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER])
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteOrganization(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.organizationService.deleteOrganization(organizationId, accessToken.sub).pipe(
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
}
