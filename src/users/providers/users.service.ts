import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from '../dtos/get-user-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

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
  ) {}

  public async createUser(createuserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createuserDto.email,
      },
    });

    let newUser = this.userRepository.create(createuserDto);
    newUser = await this.userRepository.save(newUser);

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
    return await this.userRepository.findOneBy({ id });
  }
}
