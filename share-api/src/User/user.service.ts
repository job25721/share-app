import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthInput } from './dto/auth.input';
import { NewUser } from './dto/new-user';
import { FindUserResponse, User, UserInfo } from './dto/user.model';
import { UserDocument } from './user.schema';
import { hash, compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

interface FacebookUserDataResponse {
  id: string;
  email: string;
  name: string;
}

interface FacebookPictureResponse {
  data: FacebookPirctureSource;
}
interface FacebookPirctureSource {
  height: number;
  width: number;
  is_silhouette: boolean;
  url: string;
}

interface JwtPayload {
  id: string | Types.ObjectId;
  info: UserInfo;
  email?: string;
}

@Injectable()
export class UserService {
  private saltRounds = 10;

  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserDto: NewUser): Promise<User> {
    try {
      if (createUserDto.password) {
        createUserDto.password = await hash(
          createUserDto.password,
          this.saltRounds,
        );
      }
      const newUser = new this.userModel(createUserDto);
      return newUser.save();
    } catch (err) {
      return err;
    }
  }

  async facebookSign(fbAccessToken: string): Promise<string> {
    try {
      let jwtPayload: JwtPayload = {
        id: null,
        info: null,
        email: null,
      };
      const fbUserData = await axios.get<FacebookUserDataResponse>(
        'https://graph.facebook.com/v9.0/me',
        {
          params: {
            fields: 'id,name,email',
            access_token: fbAccessToken,
          },
        },
      );

      const { id } = fbUserData.data;
      const user = await this.userModel.findOne({ facebookId: id });

      if (!user) {
        const fbAvatar = await axios.get<FacebookPictureResponse>(
          'https://graph.facebook.com/v9.0/me/picture',
          {
            params: {
              height: 720,
              width: 720,
              access_token: fbAccessToken,
              redirect: false,
            },
          },
        );
        const userAvatar = fbAvatar.data;
        const { id, email, name } = fbUserData.data;
        const newUser: NewUser = {
          email,
          info: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ').length > 1 ? name.split(' ')[1] : '',
          },
          avatar: userAvatar.data.url,
          facebookId: id,
        };
        const createdUser = await this.create(newUser);
        jwtPayload = {
          id: createdUser.id,
          info: createdUser.info,
          email: createdUser.email,
        };
      } else {
        jwtPayload = {
          id: user.id,
          info: user.info,
          email: user.email,
        };
      }
      return jwt.sign(jwtPayload, process.env.JWT_SECRET);
    } catch (error) {
      return error;
    }
  }

  async login(auth: AuthInput): Promise<string> {
    try {
      const user = await this.userModel.findOne({ username: auth.username });
      if (user && (await compare(auth.password, user.password))) {
        const jwtPayload = {
          id: user.id,
          username: user.username,
          userInfo: {
            firstName: user.info.firstName,
            lastName: user.info.lastName,
          },
        };
        return jwt.sign(jwtPayload, process.env.JWT_SECRET);
      } else {
        return 'Login Failed';
      }
    } catch (err) {
      return err;
    }
  }

  async getMyInfo(id: string): Promise<User> {
    return this.findById(id);
  }

  async findById(id: Types.ObjectId | string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findUserWithLimitedInfo(id: string): Promise<FindUserResponse> {
    const user = await this.userModel.findById(id);

    return {
      id: user.id,
      avatar: user.avatar,
      info: user.info,
    };
  }
}
