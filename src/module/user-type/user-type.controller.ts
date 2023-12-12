import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerInterceptor } from '../../interceptor/logger.interceptor';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { CreateUserTypeResponse } from './dto/create-user-type.response';
import { ListUserTypeResponse } from './dto/list-user-type.response';
import { QueryUserTypeDto } from './dto/query-user-type.dto';
import { RemoveUserTypeResponse } from './dto/remove-user-type.response';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type.response';
import { UserTypeService } from './user-type.service';

@Controller('user-type')
@ApiTags('user-type')
@UseInterceptors(new LoggerInterceptor(UserTypeController.name))
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateUserTypeResponse,
  })
  @ApiBody({
    type: CreateUserTypeDto,
  })
  public async create(
    @Body() createUserTypeDto: CreateUserTypeDto,
  ): Promise<CreateUserTypeResponse> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ListUserTypeResponse,
  })
  public async list(
    @Query() queryUserTypeDto: QueryUserTypeDto,
  ): Promise<ListUserTypeResponse[]> {
    return this.userTypeService.list(queryUserTypeDto);
  }

  @Patch(':userTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdateUserTypeResponse,
  })
  @ApiBadRequestResponse({
    description: 'Cannot update excluded UserType',
  })
  @ApiNotFoundResponse({
    description: 'No UserType found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred!',
  })
  @ApiBody({
    type: UpdateUserTypeDto,
  })
  public async update(
    @Param('userTypeId', ParseIntPipe) userTypeId: number,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UpdateUserTypeResponse> {
    let userType: UpdateUserTypeResponse;

    try {
      userType = await this.userTypeService.update(
        userTypeId,
        updateUserTypeDto,
      );
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException('An unexpected error occurred!');
    }

    return userType;
  }

  @Delete(':userTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RemoveUserTypeResponse,
  })
  public async remove(
    @Param('userTypeId', ParseIntPipe) userTypeId: number,
  ): Promise<RemoveUserTypeResponse> {
    return this.userTypeService.remove(userTypeId);
  }
}
