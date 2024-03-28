import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { AccessToken, IAccessToken } from '../../common/decorators/access-token.decorator';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { InviteEntity } from '../../models';
import { InviteService } from './invite.service';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { MembershipRole } from '../../models/membership.entity';

@ApiTags('Invites')
@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(InviteEntity) } } })
  public getInvites(@AccessToken() accessToken: IAccessToken): Promise<InviteEntity[]> {
    if (!accessToken.email) {
      throw new BadRequestException('Invalid access token');
    }

    return lastValueFrom(
      this.inviteService.getInvites(accessToken.email).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':hash')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(InviteEntity) } })
  public getInviteByHash(hash: string): Promise<InviteEntity> {
    return lastValueFrom(
      this.inviteService.getInviteByHash(hash).pipe(
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

  @Get('/organization/:organizationId')
  @ApiParam({ name: 'organizationId', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ schema: { items: { $ref: getSchemaPath(InviteEntity) } } })
  public getOrganizationInvites(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ): Promise<InviteEntity[]> {
    if (!accessToken.email) {
      throw new BadRequestException('Invalid access token');
    }

    return lastValueFrom(
      this.inviteService.getOrganizationInvites(organizationId, accessToken.sub).pipe(
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

  @Delete('/organization/:organizationId/revoke')
  @ApiParam({ name: 'organizationId', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  public revokeInvite(
    @AccessToken() accessToken: IAccessToken,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body('email') email: string,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.inviteService.revokeInvite(organizationId, accessToken.sub, email).pipe(
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

  @Post('/organization/:organizationId/create')
  @ApiParam({ name: 'organizationId', required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @ApiOkResponse({ type: InviteEntity })
  public createInvite(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body('email') email: string,
    @AccessToken() accessToken: IAccessToken,
  ): Promise<InviteEntity> {
    return lastValueFrom(
      this.inviteService.createInvite(accessToken.sub, email, organizationId).pipe(
        take(1),
        catchError(err => {
          if (err instanceof ResourceNotFoundException) {
            throw new NotFoundException(err.message);
          }

          if (err instanceof ResourceExistsException) {
            throw new ConflictException(err.message);
          }

          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Post(':hash/accept')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'hash', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  public acceptInvite(@Param('hash') hash: string, @AccessToken() accessToken: IAccessToken): Promise<void> {
    if (!accessToken.email) {
      throw new BadRequestException('Invalid access token');
    }

    return lastValueFrom(
      this.inviteService.acceptInvite(accessToken.sub, accessToken.email, hash).pipe(
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

  @Delete(':hash/decline')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'hash', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  public declineInvite(@Param('hash') hash: string, @AccessToken() accessToken: IAccessToken): Promise<DeleteResult> {
    if (!accessToken.email) {
      throw new BadRequestException('Invalid access token');
    }

    return lastValueFrom(
      this.inviteService.declineInvite(accessToken.email, hash).pipe(
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
