import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Section } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { CreateSectionResponse } from './dto/create-section.response';
import { ListSectionResponse } from './dto/list-section.response';
import { QueryListSectionDto } from './dto/query-list-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { UpdateSectionResponse } from './dto/update-section.response';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

describe('SectionController', () => {
  let sectionController: SectionController;
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
      controllers: [SectionController],
      providers: [SectionService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    sectionService = moduleRef.get<SectionService>(SectionService);
    sectionController = moduleRef.get<SectionController>(SectionController);
  });

  it('should be defined', () => {
    expect(sectionService).toBeDefined();
    expect(sectionController).toBeDefined();
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

    it('should create a new user type', async () => {
      const result = await sectionController.create(createSectionDto);

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

    it('should return a list of all user types in the system', async () => {
      const result = await sectionController.list(querySectionDto);

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

    describe('Success', () => {
      beforeEach(() => {
        prisma.section.update.mockResolvedValueOnce({
          ...section,
          description: updateSectionDto.description,
        });
        prisma.section.findFirstOrThrow.mockResolvedValueOnce(section);
      });

      it('should update the user type description', async () => {
        const result = await sectionController.update(
          section.id,
          updateSectionDto,
        );

        expect(result).toStrictEqual(updateSectionResponse);
        expect(prisma.section.update).toHaveBeenCalledWith<
          [{ where: { id: number }; data: UpdateSectionDto }]
        >({ data: updateSectionDto, where: { id: section.id } });
      });
    });

    describe('Fail', () => {
      describe('Prisma Error - Not Found', () => {
        beforeEach(() => {
          prisma.section.findFirstOrThrow.mockRejectedValueOnce(
            new PrismaClientKnownRequestError('No Section found', {
              code: 'P2025',
              clientVersion: '1',
            }),
          );
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            sectionController.update(section.id, updateSectionDto),
          ).rejects.toThrow(new NotFoundException('No Section found'));
        });
      });

      describe('Other Errors', () => {
        beforeEach(() => {
          prisma.section.findFirstOrThrow.mockResolvedValueOnce(section);
          prisma.section.update.mockRejectedValueOnce(new Error());
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            sectionController.update(section.id, updateSectionDto),
          ).rejects.toThrow(
            new InternalServerErrorException('An unexpected error occurred!'),
          );
        });
      });
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

    it('should remove a user type by adding a date to deletedAt field', async () => {
      const result = await sectionController.remove(section.id);

      expect(result.deletedAt).not.toBeNull();
      expect(result.deletedAt).not.toBeUndefined();
      expect(prisma.section.update).toHaveBeenCalled();
    });
  });
});
