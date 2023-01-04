import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService, homeSelect } from './home.service';

const mockGetHomes = [
  {
    id: 1,
    address: '12345',
    city: 'Bangkok',
    price: 1000,
    propertyType: PropertyType.RESIDENTIAL,
    number_of_bathrooms: 2,
    number_of_bedrooms: 2,
    images: [{ url: 'img1' }],
  },
];

const mockHome = {
  id: 1,
  address: '12345',
  city: 'Bangkok',
  price: 1000,
  propertyType: PropertyType.RESIDENTIAL,
  number_of_bathrooms: 2,
  number_of_bedrooms: 2,
  images: [{ url: 'img1' }],
};

const mockImages = [
  { id: 1, url: 'src1' },
  { id: 2, url: 'src2' },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  //Test GetHomes
  describe('getHomes', () => {
    const filters = {
      city: 'Bankok',
      price: {
        gte: 1000,
        lte: 40000,
      },
      propertyType: PropertyType.CONDO,
    };

    it('should call prisma home. findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw not found exception if not homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      expect(service.getHomes(filters)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createMany', () => {
    const mockCreateHomeParams = {
      address: '111 yellow Str',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Vancouver',
      landSize: 444,
      propertyType: PropertyType.RESIDENTIAL,
      price: 3000000,
      images: [{ url: 'src1' }],
    };
    it('should call prisma home.create with the correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: '111 yellow Str',
          number_of_bathrooms: 2,
          number_of_bedrooms: 2,
          city: 'Vancouver',
          land_size: 444,
          propertyType: PropertyType.RESIDENTIAL,
          price: 3000000,
          realtor_id: 1,
        },
      });
    });

    it('should call prisma image.createMany with the correct payload', async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImage);

      await service.createHome(mockCreateHomeParams, 1);

      expect(mockCreateManyImage).toBeCalledWith({
        data: [{ url: 'src1', home_id: 1 }],
      });
    });
  });
});
