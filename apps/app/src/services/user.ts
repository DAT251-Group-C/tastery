import type { AxiosResponse } from 'axios';
import { client } from './api-client';
import type { ApiUpdateUserDto, ApiUserEntity } from './api/data-contracts';

class UserService {
  public get(): Promise<AxiosResponse<ApiUserEntity>> {
    return client.userControllerGetUser();
  }

  public getById(userId: string): Promise<AxiosResponse<ApiUserEntity>> {
    return client.userControllerGetUserById(userId);
  }

  public update(data: ApiUpdateUserDto): Promise<AxiosResponse<void>> {
    return client.userControllerUpdateUser(data);
  }

  public delete(): Promise<AxiosResponse<void>> {
    return client.userControllerDeleteUser();
  }
}

export default new UserService();
