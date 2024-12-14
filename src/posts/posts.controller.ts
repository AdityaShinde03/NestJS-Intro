import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

/**
 * Controller responsible for handling requests related to blog posts.
 *
 * This controller provides endpoints for creating, updating, and retrieving blog posts.
 * It interacts with the PostsService to perform the necessary business logic.
 */
@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  /**
   * Constructs an instance of PostsController.
   *
   * @param {PostsService} postsService - The service responsible for managing post-related operations.
   */
  constructor(private readonly postsService: PostsService) {}

  /**
   * Retrieves blog posts associated with a specific user ID.
   *
   * @param {string} userId - The ID of the user whose posts are being retrieved. Optional parameter.
   * @returns {any} The blog posts associated with the given user ID.
   */
  @Get('/:userId?')
  public getPostsByUserId(@Param('userId') userId: string): any {
    return this.postsService.findAllPosts(userId);
  }

  /**
   * Creates a new blog post.
   *
   * This endpoint allows clients to create a new blog post by providing the necessary details.
   *
   * @param {CreatePostDto} createPostDto - The data transfer object containing the details of the post to create.
   * @returns {void} Logs the post data to the console.
   */
  @ApiOperation({
    summary: 'Create a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  /**
   * Updates an existing blog post.
   *
   * This endpoint allows clients to update an existing blog post by providing the updated details.
   *
   * @param {PatchPostDto} patchPostDto - The data transfer object containing the details of the post to update.
   * @returns {void} Logs the updated post data to the console.
   */
  @ApiOperation({
    summary: 'Update an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if your post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.updatePostById(patchPostDto);
  }

  @Delete()
  public deletePost(@Query('id',ParseIntPipe) id:number){
      return this.postsService.delete(id);
  }
}
