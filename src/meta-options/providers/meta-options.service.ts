import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-options.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    let metaOption = this.metaOptionRepository.create(createPostMetaOptionsDto);

    return await this.metaOptionRepository.save(metaOption);
  }
}
