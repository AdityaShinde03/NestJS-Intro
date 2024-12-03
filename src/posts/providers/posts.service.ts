import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';

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
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly meatOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    let post = this.postsRepository.create(createPostDto);

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
    const user = this.usersService.findSingleUserById(userId);
    let posts = await this.postsRepository.find()
    return posts;
  }

  public async delete(id:number){
      let post = await this.postsRepository.findOneBy({ id });
      
      await this.postsRepository.delete(id);

      await this.meatOptionsRepository.delete(post.metaOptions.id);

      return {
        deleted: true,
        id:id,
      }
  }
}
