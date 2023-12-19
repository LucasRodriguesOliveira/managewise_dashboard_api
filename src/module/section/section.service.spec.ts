import { Test, TestingModule } from '@nestjs/testing';
import { Section } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateSectionResponse } from './dto/create-section.response';
import { ListSectionResponse } from './dto/list-section.response';
import { QueryListSectionDto } from './dto/query-list-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { UpdateSectionResponse } from './dto/update-section.response';
import { SectionService } from './section.service';

describe('SectionService', () => {
  let sectionService: SectionService;
  const prisma = {
    section: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findFirstOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [SectionService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    sectionService = moduleRef.get<SectionService>(SectionService);
  });

  it('should be defined', () => {
    expect(sectionService).toBeDefined();
  });

  describe('Create', () => {
    const createSectionDto: CreateSectionDto = {
      description: randomBytes(10).toString('hex'),
    };

    const section: CreateSectionResponse = {
      id: 1,
      description: createSectionDto.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      prisma.section.create.mockResolvedValueOnce(section);
    });

    it('should create a new section', async () => {
      const result = await sectionService.create(createSectionDto);

      expect(result).toStrictEqual(section);
      expect(prisma.section.create).toHaveBeenCalledWith<
        [{ data: CreateSectionDto }]
      >({ data: createSectionDto });
    });
  });

  describe('List', () => {
    const sections = new Array<Section>(10).fill(null).map(
      (_, index): Section => ({
        id: index,
        description: randomBytes(10).toString('hex'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );

    const querySectionDto: QueryListSectionDto = {};
    const listSectionResponse = ListSectionResponse.from(sections);

    beforeEach(() => {
      prisma.section.findMany.mockResolvedValueOnce(sections);
    });

    it('should return a list of all sections in the system', async () => {
      const result = await sectionService.list(querySectionDto);

      expect(result).toStrictEqual(listSectionResponse);
      expect(result).toHaveLength(10);
      expect(prisma.section.findMany).toHaveBeenCalledWith<
        [{ where: { deletedAt: Date | null; description: string } }]
      >({ where: { deletedAt: null, description: undefined } });
    });
  });

  describe('Update', () => {
    const section: Section = {
      id: 1,
      description: 'test',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const updateSectionDto: UpdateSectionDto = {
      description: 'New Description',
    };
    const updateSectionResponse = UpdateSectionResponse.from({
      ...section,
      description: updateSectionDto.description,
    });

    beforeEach(() => {
      prisma.section.update.mockResolvedValueOnce({
        ...section,
        description: updateSectionDto.description,
      });
      prisma.section.findFirstOrThrow.mockResolvedValueOnce(section);
    });

    it('should update the section description', async () => {
      const result = await sectionService.update(section.id, updateSectionDto);

      expect(result).toStrictEqual(updateSectionResponse);
      expect(prisma.section.update).toHaveBeenCalledWith<
        [{ where: { id: number }; data: UpdateSectionDto }]
      >({ data: updateSectionDto, where: { id: section.id } });
    });
  });

  describe('Delete', () => {
    const section: Section = {
      id: randomInt(100),
      description: randomBytes(10).toString('hex'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    beforeEach(() => {
      prisma.section.update.mockResolvedValueOnce({
        ...section,
        deletedAt: new Date(),
      });
    });

    it('should remove a section by adding a date to deletedAt field', async () => {
      const result = await sectionService.remove(section.id);

      expect(result.deletedAt).not.toBeNull();
      expect(result.deletedAt).not.toBeUndefined();
      expect(prisma.section.update).toHaveBeenCalled();
    });
  });
});
