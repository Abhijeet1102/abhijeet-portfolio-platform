import { ProfileRepository } from '../repositories/ProfileRepository';
import { UpdateProfileDto } from '../validators/profile.dto';

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getProfile() {
    let profile = await this.profileRepository.getGlobalProfile();
    
    // Auto-initialize profile if it doesn't exist
    if (!profile) {
      profile = await this.profileRepository.create({
        name: 'John Doe',
        title: 'Developer',
        headline: 'Full Stack Developer',
        bio: 'Hello, World!',
        location: 'Earth',
        email: 'john.doe@example.com',
        availabilityStatus: 'AVAILABLE',
      } as any);
    }
    
    return profile;
  }

  async updateProfile(data: UpdateProfileDto) {
    const profile = await this.getProfile();
    
    const updated = await this.profileRepository.update((profile._id as any).toString(), data as any);
    if (!updated) throw new Error('Failed to update profile');
    
    return updated;
  }
}
