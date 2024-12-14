import { Body, Controller, Delete, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  /**
   * Constructs an instance of PostsController.
   *
   * * @param {TagsService} tagsService - The service responsible for managing tags-related operations.
   */
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  public createTag(@Body() createTagDto: CreateTagDto) {    
    return this.tagsService.createTag(createTagDto);
  }

  @Delete()
  public deleteTag(@Query('id',ParseIntPipe) id: number) {
    return this.tagsService.deleteTagById(id);
  }
  @Delete('soft-delete')
  public softDeleteTag(@Query('id',ParseIntPipe) id: number) {
    return this.tagsService.softRemoveTag(id);
  }
}
