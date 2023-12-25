import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { CreatePermissionGroupResponse } from './dto/create-permission-group.response';
import {
  IPermissionGroup,
  ListPermissionGroupResponse,
} from './dto/list-permission-group.response';
import { QueryPermissionGroupDto } from './dto/query-permission-group.dto';
import { PermissionGroupController } from './permission-group.controller';
import { PermissionGroupService } from './permission-group.service';

describe('PermissionGroupController', () => {
  let permissionGroupController: PermissionGroupController;
  let permissionGroupService: PermissionGroupService;
  const prisma = {
    userTypePermission: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGroupService,
        { provide: PrismaService, useValue: prisma },
      ],
      controllers: [PermissionGroupController],
    }).compile();

    permissionGroupService = moduleRef.get<PermissionGroupService>(
      PermissionGroupService,
    );
    permissionGroupController = moduleRef.get<PermissionGroupController>(
      PermissionGroupController,
    );
  });

  it('should be defined', () => {
    expect(permissionGroupService).toBeDefined();
    expect(permissionGroupController).toBeDefined();
  });

  describe('Create', () => {
    const createPermissionGroupDto: CreatePermissionGroupDto = {
      userTypeId: randomInt(100),
      permissionId: randomInt(100),
    };

    const createPermissionGroupResponse: CreatePermissionGroupResponse = {
      id: randomInt(100),
      userTypeId: createPermissionGroupDto.userTypeId,
      permissionId: createPermissionGroupDto.permissionId,
    };

    beforeEach(() => {
      prisma.userTypePermission.create.mockResolvedValueOnce(
        createPermissionGroupResponse,
      );
    });

    it('should create a permission group', async () => {
      const result = await permissionGroupController.create(
        createPermissionGroupDto,
      );

      expect(result).toEqual(createPermissionGroupResponse);
    });
  });

  describe('List', () => {
    const queryPermissionGroupDto: QueryPermissionGroupDto = {
      userTypeId: randomInt(100),
    };

    const groups: IPermissionGroup[] = [
      {
        id: randomInt(100),
        permission: {
          id: randomInt(100),
          createdAt: new Date(),
          deletedAt: null,
          description: randomBytes(10).toString('hex'),
          isActive: true,
          updatedAt: new Date(),
        },
        userType: {
          id: queryPermissionGroupDto.userTypeId,
          createdAt: new Date(),
          deletedAt: null,
          description: randomBytes(10).toString('hex'),
          isActive: true,
          updatedAt: new Date(),
        },
      },
    ];

    const listPermissionGroupResponse = groups.map(
      ListPermissionGroupResponse.from,
    );

    beforeEach(() => {
      prisma.userTypePermission.findMany.mockResolvedValueOnce(groups);
    });

    it('should list all permission groups by a user type id', async () => {
      const result = await permissionGroupController.list(
        queryPermissionGroupDto,
      );

      expect(result).toStrictEqual(listPermissionGroupResponse);
    });
  });

  describe('Delete', () => {
    const permissionGroupId = randomInt(100);

    beforeEach(() => {
      prisma.userTypePermission.delete.mockResolvedValueOnce({
        id: permissionGroupId,
      });
    });

    it('should delete a permission group by id', async () => {
      const result = await permissionGroupController.delete(permissionGroupId);

      expect(result).toBeTruthy();
    });
  });
});
