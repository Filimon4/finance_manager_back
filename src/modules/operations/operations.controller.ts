import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../../common/decorators/account.decorator';
import { IReqAccount } from '../auth/interface/account.interface';
import {
  CreatOperationRequestDto,
  GetOperationsRequestDto,
  UpdateOperationsRequestDto,
} from './dto/operations.dto';
import { OperationsService } from './operations.service';

@Controller({
  path: 'operations',
  version: '1',
})
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('/')
  async getAll(
    @Account('id') accountId: IReqAccount['id'],
    @Query() dto: GetOperationsRequestDto,
  ) {
    const result = await this.operationsService.getOperations(accountId, dto);

    return result;
  }

  @Get('/:id')
  async getById(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    const result = await this.operationsService.getById(accountId, id);

    return result;
  }

  @Post('/')
  async create(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: CreatOperationRequestDto,
  ) {
    const result = await this.operationsService.createOperation(accountId, dto);

    return result;
  }

  @Patch('/')
  async update(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: UpdateOperationsRequestDto,
  ) {
    const result = await this.operationsService.updateOperation(accountId, dto);

    return result;
  }

  @Delete('/:id')
  async delete(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    const result = this.operationsService.delete(accountId, id);

    return result;
  }
}
