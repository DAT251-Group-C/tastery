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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, lastValueFrom, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserId } from '../../common/decorators/user-id.decorator';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { User } from '../../common/models';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  public getUser(@UserId() userId: string): Promise<User> {
    return lastValueFrom(
      this.userService.getUserById(userId).pipe(
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

  @Get(':userId')
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({ type: User })
  public getUserById(@Param('userId', new ParseUUIDPipe()) userId: string): Promise<User> {
    return lastValueFrom(
      this.userService.getUserById(userId).pipe(
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

  @Patch()
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateUser(@UserId() userId: string, @Body() body: UpdateUserDto): Promise<UpdateResult> {
    return lastValueFrom(
      this.userService.updateUser(userId, body).pipe(
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

  @Delete()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteUser(@UserId() userId: string): Promise<DeleteResult> {
    return lastValueFrom(
      this.userService.deleteUser(userId).pipe(
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
