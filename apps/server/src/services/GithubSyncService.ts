import { Octokit } from '@octokit/rest';
import { GithubSettings } from '../models/GithubSettings';
import { Repository } from '../models/Repository';
import { Project } from '../models/Project';
import slugify from 'slugify';

export class GithubSyncService {
  private octokit: Octokit | null = null;

  private async initializeOctokit() {
    const settings = await GithubSettings.findOne();
    if (!settings || !settings.accessToken) {
      throw new Error('GitHub is not connected or token is missing');
    }

    this.octokit = new Octokit({ auth: settings.accessToken });
  }

  async syncAllRepositories() {
    await this.initializeOctokit();

    try {
      const { data: repos } = await this.octokit!.repos.listForAuthenticatedUser({
        visibility: 'public',
        affiliation: 'owner',
        sort: 'updated',
        per_page: 100,
      });

      const syncResults = { added: 0, updated: 0, failed: 0 };

      for (const repo of repos) {
        try {
          const { data: languages } = await this.octokit!.repos.listLanguages({
            owner: repo.owner.login,
            repo: repo.name,
          });

          let readmeContent = '';
          try {
            const { data: readme } = await this.octokit!.repos.getReadme({
              owner: repo.owner.login,
              repo: repo.name,
            });
            readmeContent = Buffer.from(readme.content, 'base64').toString('utf-8');
          } catch (e) {
            // Readme might not exist
          }

          const repoData = {
            githubId: repo.id.toString(),
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || '',
            htmlUrl: repo.html_url,
            homepage: repo.homepage || '',
            topics: repo.topics || [],
            language: repo.language || '',
            languages: languages || {},
            stargazersCount: repo.stargazers_count || 0,
            forksCount: repo.forks_count || 0,
            openIssuesCount: repo.open_issues_count || 0,
            defaultBranch: repo.default_branch,
            license: repo.license?.name || '',
            readme: readmeContent,
            pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(),
            lastSyncedAt: new Date(),
          };

          const existingRepo = await Repository.findOne({ githubId: repo.id.toString() });

          if (existingRepo) {
            await Repository.updateOne({ githubId: repo.id.toString() }, repoData);
            syncResults.updated++;
          } else {
            await Repository.create(repoData);
            syncResults.added++;
          }

          // Auto-sync to projects if it has specific topic or by default
          await this.syncRepoToProject(repoData);

        } catch (repoError) {
          console.error(`Failed to sync repo ${repo.name}:`, repoError);
          syncResults.failed++;
        }
      }

      return syncResults;
    } catch (error: any) {
      console.error('Failed to sync repositories:', error);
      throw new Error(`GitHub sync failed: ${error.message}`);
    }
  }

  private async syncRepoToProject(repoData: any) {
    // Determine if we should create a project from this repo.
    // For example, if it has 'portfolio-project' topic.
    if (!repoData.topics.includes('portfolio-project')) {
      return;
    }

    const slug = slugify(repoData.name, { lower: true, strict: true });
    
    // Check if project exists
    const existingProject = await Project.findOne({ 
      $or: [{ githubRepository: repoData.htmlUrl }, { slug }] 
    });

    if (existingProject) {
      // Update specific fields that might have changed
      existingProject.stargazersCount = repoData.stargazersCount;
      existingProject.forksCount = repoData.forksCount;
      // We don't overwrite title/description as the user might have edited them in CMS
      await existingProject.save();
    } else {
      // Create draft project
      await Project.create({
        title: repoData.name.replace(/-/g, ' '),
        slug,
        shortDescription: repoData.description || 'A project imported from GitHub.',
        fullDescription: repoData.readme || repoData.description || '',
        category: 'WEB', // Default category
        status: 'DRAFT',
        githubRepository: repoData.htmlUrl,
        liveDemo: repoData.homepage || '',
        technologies: Object.keys(repoData.languages),
        tags: repoData.topics,
      });
    }
  }

  // Webhook payload processor
  async processWebhook(event: string, payload: any) {
    if (event === 'push') {
      const githubId = payload.repository.id.toString();
      const repo = await Repository.findOne({ githubId });
      
      // If we track this repo, we can queue a single sync for it
      // For simplicity, trigger a full sync or just update specific fields
      if (repo) {
        repo.pushedAt = new Date(payload.repository.pushed_at * 1000);
        await repo.save();
      }
    }

    // handle other events like star, fork etc.
  }
}
