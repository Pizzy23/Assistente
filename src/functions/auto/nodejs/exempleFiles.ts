import { File } from "./files";

export class ExempleFiles {
  constructor() {}
  instanceFiles(item) {
    const firstUpperCase = item.charAt(0).toUpperCase() + item.slice(1);

    const service = {
      desc: "service",
      command: `
import { ${firstUpperCase}Entity } from 'src/context/entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class ${firstUpperCase}Service {
  constructor(private repository: ${firstUpperCase}Entity) {}
  async ${firstUpperCase}() {}
}
`,
    };

    const interf = {
      desc: "interface",
      command: `export interface ${firstUpperCase}{}`,
    };

    const entity = {
      desc: "entity",
      command: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config';

@Injectable()
export class ${firstUpperCase}Entity {
  constructor(private prisma: PrismaService) {}
  async ${firstUpperCase}(input) {
    await this.prisma.user.create({
      data: input,
    });
  }
}`,
    };

    const controller = {
      desc: "controller",
      command: `
import { ${firstUpperCase}Service } from 'src/context/service';
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('${firstUpperCase}')
@Controller('/${firstUpperCase}')
export class ${firstUpperCase}Controller {
  constructor(private readonly service: ${firstUpperCase}Service) {}

  @ApiOperation({
    summary: '',
  })
  @Post('/')
  async post${firstUpperCase}(@Body() input: any): Promise<void> {}
}`,
    };

    const dto = {
      desc: "dto",
      command: `
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

@Injectable()
export class ${firstUpperCase}Dto {
  @ApiProperty()
  @IsString()
  exemple: string;
}`,
    };

    const commands = [service, entity, dto, interf, controller];
    return commands;
  }

  instanceFilesGo(item: string) {
    const firstUpperCase = item.charAt(0).toUpperCase() + item.slice(1);
    const pkg = {
      desc: "packages",
      command: `package ${firstUpperCase}`,
    };
    return pkg;
  }
}
