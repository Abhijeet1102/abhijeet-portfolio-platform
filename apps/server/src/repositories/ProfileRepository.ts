import { BaseRepository } from './BaseRepository';
import { Profile, IProfile } from '../models/Profile';

export class ProfileRepository extends BaseRepository<IProfile> {
  constructor() {
    super(Profile);
  }

  async getGlobalProfile(): Promise<IProfile | null> {
    return this.model.findOne().exec();
  }
}
