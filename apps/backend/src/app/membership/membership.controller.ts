import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, switchMap, take } from 'rxjs';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { FullMembership, Membership } from '../../common/models';
import { MembershipRole } from '../../common/models/membership.model';
import { UpdateMembershipRoleDto } from './dto/update-membership-role.dto';
import { MembershipService } from './membership.service';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { DeleteResult } from 'typeorm';

@ApiTags('Memberships')
@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('memberships')
  @ApiBearerAuth()
  @ApiOkResponsePaginated(Membership)
  public getMemberships(@UserId() userId: string, @Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Membership>> {
    return lastValueFrom(
      this.membershipService.getMemberships(userId, pageOptionsDto).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get('memberships/:organizationId')
  @ApiBearerAuth()
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiOkResponse({ type: FullMembership })
  public getMembership(@UserId() userId: string, @Param('organizationId') organizationId: string): Promise<FullMembership> {
    return lastValueFrom(
      this.membershipService.getMembership(organizationId, userId).pipe(
        take(1),
        switchMap(async membership => ({
          ...membership,
          user: await membership.user,
          organization: await membership.organization,
        })),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get('organizations/:organizationId/memberships')
  @ApiBearerAuth()
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiOkResponsePaginated(Membership)
  public getMembershipsInOrganization(
    @UserId() userId: string,
    @Param('organizationId') organizationId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Membership>> {
    return lastValueFrom(
      this.membershipService.getMembershipsInOrganization(organizationId, userId, pageOptionsDto).pipe(
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

  @Post('organizations/:organizationId/memberships/role')
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER])
  @ApiBody({ type: UpdateMembershipRoleDto })
  @ApiBearerAuth()
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateMembershipRole(
    @UserId() userId: string,
    @Param('organizationId') organizationId: string,
    @Body() body: UpdateMembershipRoleDto,
  ): Promise<void> {
    return lastValueFrom(
      this.membershipService.updateMembershipRole(organizationId, userId, body).pipe(
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

  @Delete('organizations/:organizationId/memberships/:userId')
  @ApiBearerAuth()
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeMembership(
    @UserId() userId: string,
    @Param('organizationId') organizationId: string,
    @Param('userId') userIdToRemove: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.membershipService.removeMembership(organizationId, userId, userIdToRemove).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourcePermissionDeniedException) {
            throw new ForbiddenException(err.message);
          }

          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }
}
