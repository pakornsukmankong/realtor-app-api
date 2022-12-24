import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomesResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(): Promise<HomesResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedroom: true,
        Images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.Images[0].url };
      delete fetchHome.Images;
      return new HomesResponseDto(fetchHome);
    });
  }
}
