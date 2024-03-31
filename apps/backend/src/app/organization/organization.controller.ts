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
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, switchMap, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserId } from '../../common/decorators/user-id.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { FullOrganization, Organization } from '../../common/models';
import { MembershipRole } from '../../common/models/membership.model';
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
  @ApiOkResponse({ type: FullOrganization, isArray: true })
  public getOrganizations(@UserId() userId: string): Promise<FullOrganization[]> {
    return lastValueFrom(
      this.organizationService.getOrganizations(userId).pipe(
        take(1),
        switchMap(organizations => {
          return Promise.all(
            organizations.map(async organization => ({
              ...organization,
              projects: await organization.projects,
              memberships: await organization.memberships,
            })),
          );
        }),
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
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiOkResponse({ type: FullOrganization })
  public getOrganizationById(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<FullOrganization> {
    return lastValueFrom(
      this.organizationService.getOrganizationById(organizationId, userId).pipe(
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
  @ApiBody({ type: CreateOrganizationDto })
  @ApiOkResponse({ type: Organization })
  public createOrganization(@UserId() userId: string, @Body() body: CreateOrganizationDto): Promise<Organization> {
    return lastValueFrom(
      this.organizationService.createOrganization(body, userId).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Patch(':organizationId')
  @ApiBearerAuth()
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiBody({ type: UpdateOrganizationDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateOrganization(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() body: UpdateOrganizationDto,
  ): Promise<UpdateResult> {
    return lastValueFrom(
      this.organizationService.updateOrganization(organizationId, userId, body).pipe(
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
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER])
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteOrganization(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.organizationService.deleteOrganization(organizationId, userId).pipe(
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
