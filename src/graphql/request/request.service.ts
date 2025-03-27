import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestInput } from './dto/create-request.input';
import { Request } from './entities/request.entity';
import { UpdateRequestInput } from './dto/update-request.input';
import { DeleteRequestInput } from './dto/delete-request.input';

@Injectable()
export class RequestService {
  private readonly allRelations: string[];
  constructor(
    @InjectRepository(Request)
    private repo: Repository<Request>,
  ) {
    this.allRelations = this.repo.metadata.relations.map(
      (rel) => rel.propertyName,
    );
  }

  async create(
    createRequestInput: CreateRequestInput,
    requestorId: number,
  ): Promise<Request> {
    const { requestedId, ...rest } = createRequestInput;

    const request = this.repo.create({
      ...rest,
      requestor: { id: requestorId },
      ...(requestedId ? { requested: { id: requestedId } } : {}),
    });

    return await this.repo.save(request);
  }

  async update(
    updateRequestInput: UpdateRequestInput,
  ): Promise<Request | null> {
    const { id, requestedId, ...rest } = updateRequestInput;

    const result = await this.repo.update(id, {
      ...rest,
      ...(requestedId ? { requested: { id: requestedId } } : {}),
    });

    if (!result.affected && result.affected == 0) {
      throw new Error('No changes occured');
    }

    return await this.findOne(id);
  }

  async delete(deleteRequestInput: DeleteRequestInput): Promise<boolean> {
    const { id } = deleteRequestInput;

    await this.repo.delete(id);

    return true;
  }

  async findAll(): Promise<Request[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Request | null> {
    return await this.repo.findOne({
      where: { id },
      relations: this.allRelations,
    });
  }
}
