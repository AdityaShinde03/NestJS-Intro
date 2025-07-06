import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateManyUsersDTO } from '../dtos/create-many-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';

/**
 * Service responsible for managing user-related business operations.
 *
 * This service handles operations related to the Users table, such as
 * retrieving all users or finding a specific user by their ID. It also
 * interacts with the authentication service to ensure proper access controls.
 */
@Injectable()
export class UsersService {
  /**
   * Constructs an instance of UsersService.
   *
   * @param {AuthService} authService - The authentication service used to verify user authentication.
   */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersCreateManyProvider: UsersCreateManyProvider
  ) {}

  public async createUser(createuserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createuserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    let newUser = this.userRepository.create(createuserDto);

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return newUser;
  }

  /**
   * Retrieves all users from the database with optional filters.
   *
   * @param {GetUserParamsDto} getUsersParamsDto - The parameters for filtering users.
   * @param {number} limit - The maximum number of users to retrieve.
   * @param {number} page - The page number for pagination.
   * @returns {Array<Object>} An array of user objects.
   */

  public async findAllUsers(
    getUsersParamsDto: GetUserParamsDto,
    limit: number,
    page: number,
  ): Promise<User[]> {
    // const isAuth = this.authService.isAuthenticated();
    // const allUsers = [
    //   {
    //     firstName: 'Aditya',
    //     email: 'aditya@gmail.com',
    //   },
    //   {
    //     firstName: 'John',
    //     email: 'John@Doe.com',
    //   },
    // ];

    const allUsersFromDB = await this.userRepository.find({});

    return allUsersFromDB;
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param {number} id - The unique identifier of the user.
   * @returns {User} An object containing user details.
   */

  public async findSingleUserById(id: number): Promise<User> {
    let user = undefined;

    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    /**
     * Handle the user does not exists exists
     */
    if (!user) {
      throw new BadRequestException('The user id does not exists', {
        description: '',
      });
    }
    return user;
  }

  public async createManyUser(createManyUsersDto: CreateManyUsersDTO) {
    return await this.usersCreateManyProvider.createManyUser(createManyUsersDto);
  }
}
