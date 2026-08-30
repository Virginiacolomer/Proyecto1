import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('producto')
  @UseInterceptors(FileInterceptor('file'))
  uploadProducto(
    @UploadedFile() file: Express.Multer.File
  ) { 
    return file;
  }
}