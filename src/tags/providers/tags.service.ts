import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from 'src/tags/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    let result = await this.tagsRepository.find({
      where: {
        id: In(tags)
      }
    });
    return result
  }

  public async deleteTagById(id: number) {
    await this.tagsRepository.delete(id);

    return {
      deleted: true,
      id
    }
  }

  public async softRemoveTag(id: number) {
    await this.tagsRepository.softDelete(id);

    return {
      deleted: true,
      id
    }
  }
}
