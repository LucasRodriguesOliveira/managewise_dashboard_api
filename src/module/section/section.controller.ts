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
  ValidationPipe,
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
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateSectionResponse } from './dto/create-section.response';
import { ListSectionResponse } from './dto/list-section.response';
import { QueryListSectionDto } from './dto/query-list-section.dto';
import { RemoveSectionResponse } from './dto/remove-section.response';
import { UpdateSectionDto } from './dto/update-section.dto';
import { UpdateSectionResponse } from './dto/update-section.response';
import { SectionService } from './section.service';

@Controller('section')
@ApiTags('section')
@UseInterceptors(new LoggerInterceptor(SectionController.name))
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateSectionResponse,
  })
  @ApiBody({
    type: CreateSectionDto,
  })
  public async create(
    @Body(ValidationPipe) createSectionDto: CreateSectionDto,
  ): Promise<CreateSectionDto> {
    return this.sectionService.create(createSectionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ListSectionResponse,
  })
  public async list(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    queryListSectionDto: QueryListSectionDto,
  ): Promise<ListSectionResponse[]> {
    return this.sectionService.list(queryListSectionDto);
  }

  @Patch(':sectionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdateSectionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Cannot update excluded Section',
  })
  @ApiNotFoundResponse({
    description: 'No Section found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An unexpected error occurred!',
  })
  @ApiBody({
    type: UpdateSectionDto,
  })
  public async update(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<UpdateSectionResponse> {
    let section: UpdateSectionResponse;

    try {
      section = await this.sectionService.update(sectionId, updateSectionDto);
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException('An unexpected error occurred!');
    }

    return section;
  }

  @Delete(':sectionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RemoveSectionResponse,
  })
  public async remove(
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ): Promise<RemoveSectionResponse> {
    return this.sectionService.remove(sectionId);
  }
}
