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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { ApiOkResponsePaginated } from '../../common/decorators/api-ok-response-paginated.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserEmail } from '../../common/decorators/user-email.decorator';
import { UserId } from '../../common/decorators/user-id.decorator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MembershipRoleGuard } from '../../common/guards/membership-role/membership-role.guard';
import { MembershipRoles } from '../../common/guards/membership-role/membership-roles.decorator';
import { Invite } from '../../common/models';
import { MembershipRole } from '../../common/models/membership.model';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RevokeInviteDto } from './dto/delete-invite.dto';
import { InviteService } from './invite.service';

@ApiTags('Invites')
@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: Invite })
  public getInvites(@UserEmail() email: string): Promise<Invite[]> {
    return lastValueFrom(
      this.inviteService.getInvites(email).pipe(
        take(1),
        catchError(err => {
          throw new BadRequestException(err.message || err);
        }),
      ),
    );
  }

  @Get(':hash')
  @Public()
  @ApiOkResponse({ type: Invite })
  public getInviteByHash(hash: string): Promise<Invite> {
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
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiBearerAuth()
  @ApiOkResponsePaginated(Invite)
  public getOrganizationInvites(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Invite>> {
    return lastValueFrom(
      this.inviteService.getOrganizationInvites(organizationId, userId, pageOptionsDto).pipe(
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
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateInviteDto })
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @ApiOkResponse({ type: Invite })
  public createInvite(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() body: CreateInviteDto,
    @UserId() userId: string,
  ): Promise<Invite> {
    return lastValueFrom(
      this.inviteService.createInvite(userId, body, organizationId).pipe(
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
  @ApiParam({ name: 'hash' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public acceptInvite(@Param('hash') hash: string, @UserId() userId: string, @UserEmail() email: string): Promise<void> {
    return lastValueFrom(
      this.inviteService.acceptInvite(userId, email, hash).pipe(
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
  @ApiParam({ name: 'hash' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public declineInvite(@Param('hash') hash: string, @UserEmail() email: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.inviteService.declineInvite(email, hash).pipe(
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
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiBearerAuth()
  @ApiBody({ type: RevokeInviteDto })
  @UseGuards(MembershipRoleGuard)
  @MembershipRoles([MembershipRole.OWNER, MembershipRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  public revokeInvite(
    @UserId() userId: string,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() body: RevokeInviteDto,
  ): Promise<DeleteResult> {
    return lastValueFrom(
      this.inviteService.revokeInvite(organizationId, userId, body.email).pipe(
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
