import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

const mockUser = {
  id: 53,
  name: 'Floksong',
  email: 'floksong.001@gmail.com',
  phone: '0850379654',
};

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

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Bangkok', '10000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Bangkok',
        price: {
          gte: 10000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      name: 'Floksong',
      id: 30,
      iat: 1,
      exp: 2,
    };

    const mockUpdateHomeParams = {
      address: '111 yellow Str',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Vancouver',
      landSize: 444,
      propertyType: PropertyType.RESIDENTIAL,
      price: 3000000,
      images: [{ url: 'src1' }],
    };

    it('should throw unauth error if realtor did not create home', async () => {
      expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should update home if realtor id is valid', async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(homeService, 'updateHomeById')
        .mockImplementation(mockUpdateHome);

      await controller.updateHome(5, mockUpdateHomeParams, {
        ...mockUserInfo,
        id: 53,
      });

      expect(mockUpdateHome).toBeCalled();
    });
  });
});
