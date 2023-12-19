import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateSectionResponse } from './dto/create-section.response';
import { ListSectionResponse } from './dto/list-section.response';
import { QueryListSectionDto } from './dto/query-list-section.dto';
import { RemoveSectionResponse } from './dto/remove-section.response';
import { UpdateSectionDto } from './dto/update-section.dto';
import { UpdateSectionResponse } from './dto/update-section.response';

@Injectable()
export class SectionService {
  constructor(private readonly prisma: PrismaService) {}

  public async create({
    description,
  }: CreateSectionDto): Promise<CreateSectionResponse> {
    const section = await this.prisma.section.create({
      data: { description },
    });

    return CreateSectionResponse.from(section);
  }

  public async list({
    description,
    includeExcluded,
  }: QueryListSectionDto): Promise<ListSectionResponse[]> {
    let deletedAt: Date;

    if (!includeExcluded) {
      deletedAt = null;
    }

    const sections = await this.prisma.section.findMany({
      where: {
        deletedAt,
        description,
      },
    });

    return ListSectionResponse.from(sections);
  }

  async update(
    sectionId: number,
    updateUseTypeDto: UpdateSectionDto,
  ): Promise<UpdateSectionResponse> {
    const isDeleted = await this.checkIsDeleted(sectionId);

    if (isDeleted) {
      throw new BadRequestException('Cannot update excluded Section');
    }

    const section = await this.prisma.section.update({
      data: updateUseTypeDto,
      where: { id: sectionId },
    });

    return UpdateSectionResponse.from(section);
  }

  async remove(sectionId: number): Promise<RemoveSectionResponse> {
    const section = await this.prisma.section.update({
      where: { id: sectionId },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return RemoveSectionResponse.from(section);
  }

  private async checkIsDeleted(sectionId: number): Promise<boolean> {
    const section = await this.prisma.section.findFirstOrThrow({
      where: { id: sectionId },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    return !!section.deletedAt;
  }
}
