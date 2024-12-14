import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

/**
 * Service responsible for handling operations related to blog posts.
 *
 * The `PostsService` provides methods to interact with posts, such as retrieving posts by user ID.
 */
@Injectable()
export class PostsService {
  /**
   * Constructs an instance of `PostsService`.
   *
   * @param {UsersService} usersService - The service responsible for managing user-related operations.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly meatOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    let author = await this.usersService.findSingleUserById(
      createPostDto.authorId,
    );
    // Find tags
    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }
  /**
   * Retrieves posts associated with a specific user ID.
   *
   * This method fetches the user based on the provided user ID and returns a list of posts associated with that user.
   *
   * @param {string} userId - The ID of the user whose posts are being retrieved.
   * @returns {Promise<Post[]>} An array of posts, each containing the user information, title, and content.
   */
  public async findAllPosts(userId: string): Promise<Post[]> {
    let posts = await this.postsRepository.find();
    return posts;
  }

  public async updatePostById(patchPostDto: PatchPostDto) {
    // Find the Tags
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags)
    // Find the Post
    let post = await this.postsRepository.findOneBy({id:patchPostDto.id})
    // Update the properties of the Post
    post.title = patchPostDto.title ?? post.title
    post.content = patchPostDto.content ?? post.content
    post.slug = patchPostDto.slug ?? post.slug
    post.status = patchPostDto.status ?? post.status
    post.schema = patchPostDto.schema ?? post.schema
    post.postType = patchPostDto.postType ?? post.postType
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl
    post.publishOn = patchPostDto.publishOn ?? post.publishOn
    //  Assign the new tags
    post.tags = tags
    // Save the post and return 
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    //    Deleting Post
    await this.postsRepository.delete(id);
    //    Confirmation of Deleted Post
    return {
      deleted: true,
      id: id,
    };
  }
}
