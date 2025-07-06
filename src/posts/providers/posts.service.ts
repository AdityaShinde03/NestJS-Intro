import {
  BadGatewayException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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
    private readonly paginationProvider: PaginationProvider,
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
  public async findAllPosts(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
    return posts;
  }

  public async updatePostById(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;
    // Find the Tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadGatewayException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    // Find the Post
    try {
      post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadGatewayException('The post Id does not exists');
    }

    // Update the properties of the Post
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.slug = patchPostDto.slug ?? post.slug;
    post.status = patchPostDto.status ?? post.status;
    post.schema = patchPostDto.schema ?? post.schema;
    post.postType = patchPostDto.postType ?? post.postType;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    //  Assign the new tags
    post.tags = tags;
    // Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return post;
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
