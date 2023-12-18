import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { CreateUserTypeResponse } from './dto/create-user-type.response';
import { ListUserTypeResponse } from './dto/list-user-type.response';
import { QueryUserTypeDto } from './dto/query-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UpdateUserTypeResponse } from './dto/update-user-type.response';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';

describe('UserTypeController', () => {
  let userTypeController: UserTypeController;
  let userTypeService: UserTypeService;
  const prisma = {
    userType: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findFirstOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserTypeController],
      providers: [
        UserTypeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    userTypeService = moduleRef.get<UserTypeService>(UserTypeService);
    userTypeController = moduleRef.get<UserTypeController>(UserTypeController);
  });

  it('should be defined', () => {
    expect(userTypeService).toBeDefined();
    expect(userTypeController).toBeDefined();
  });

  describe('Create', () => {
    const createUserTypeDto: CreateUserTypeDto = {
      description: randomBytes(10).toString('hex'),
    };

    const userType: CreateUserTypeResponse = {
      id: 1,
      description: createUserTypeDto.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      prisma.userType.create.mockResolvedValueOnce(userType);
    });

    it('should create a new user type', async () => {
      const result = await userTypeController.create(createUserTypeDto);

      expect(result).toStrictEqual(userType);
      expect(prisma.userType.create).toHaveBeenCalledWith<
        [{ data: CreateUserTypeDto }]
      >({ data: createUserTypeDto });
    });
  });

  describe('List', () => {
    const userTypes = new Array<UserType>(10).fill(null).map(
      (_, index): UserType => ({
        id: index,
        description: randomBytes(10).toString('hex'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );

    const queryUserTypeDto: QueryUserTypeDto = {};
    const listUserTypeResponse = ListUserTypeResponse.from(userTypes);

    beforeEach(() => {
      prisma.userType.findMany.mockResolvedValueOnce(userTypes);
    });

    it('should return a list of all user types in the system', async () => {
      const result = await userTypeController.list(queryUserTypeDto);

      expect(result).toStrictEqual(listUserTypeResponse);
      expect(result).toHaveLength(10);
      expect(prisma.userType.findMany).toHaveBeenCalledWith<
        [{ where: { deletedAt: Date | null; description: string } }]
      >({ where: { deletedAt: null, description: undefined } });
    });
  });

  describe('Update', () => {
    const userType: UserType = {
      id: 1,
      description: 'test',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const updateUserTypeDto: UpdateUserTypeDto = {
      description: 'New Description',
    };
    const updateUserTypeResponse = UpdateUserTypeResponse.from({
      ...userType,
      description: updateUserTypeDto.description,
    });

    describe('Success', () => {
      beforeEach(() => {
        prisma.userType.update.mockResolvedValueOnce({
          ...userType,
          description: updateUserTypeDto.description,
        });
        prisma.userType.findFirstOrThrow.mockResolvedValueOnce(userType);
      });

      it('should update the user type description', async () => {
        const result = await userTypeController.update(
          userType.id,
          updateUserTypeDto,
        );

        expect(result).toStrictEqual(updateUserTypeResponse);
        expect(prisma.userType.update).toHaveBeenCalledWith<
          [{ where: { id: number }; data: UpdateUserTypeDto }]
        >({ data: updateUserTypeDto, where: { id: userType.id } });
      });
    });

    describe('Fail', () => {
      describe('Prisma Error - Not Found', () => {
        beforeEach(() => {
          prisma.userType.findFirstOrThrow.mockRejectedValueOnce(
            new PrismaClientKnownRequestError('No UserType found', {
              code: 'P2025',
              clientVersion: '1',
            }),
          );
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            userTypeController.update(userType.id, updateUserTypeDto),
          ).rejects.toThrow(new NotFoundException('No UserType found'));
        });
      });

      describe('Other Errors', () => {
        beforeEach(() => {
          prisma.userType.findFirstOrThrow.mockResolvedValueOnce(userType);
          prisma.userType.update.mockRejectedValueOnce(new Error());
        });

        it('should throw an error for not findind the specified user type', async () => {
          expect(() =>
            userTypeController.update(userType.id, updateUserTypeDto),
          ).rejects.toThrow(
            new InternalServerErrorException('An unexpected error occurred!'),
          );
        });
      });
    });
  });

  describe('Delete', () => {
    const userType: UserType = {
      id: randomInt(100),
      description: randomBytes(10).toString('hex'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    beforeEach(() => {
      prisma.userType.update.mockResolvedValueOnce({
        ...userType,
        deletedAt: new Date(),
      });
    });

    it('should remove a user type by adding a date to deletedAt field', async () => {
      const result = await userTypeController.remove(userType.id);

      expect(result.deletedAt).not.toBeNull();
      expect(result.deletedAt).not.toBeUndefined();
      expect(prisma.userType.update).toHaveBeenCalled();
    });
  });
});
