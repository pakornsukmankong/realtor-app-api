import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { HomesResponseDto } from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomesResponseDto[]> {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHomeById() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return;
  }
}
