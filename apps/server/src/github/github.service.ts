export class GitHubService {
  static async fetchRepositories() { return []; }
  static async fetchReadme(repoName: string) { return ""; }
  static async fetchLanguages(repoName: string) { return {}; }
}

export class ProjectSyncService {
  static async syncRepositoryToProject(repo: any) { 
    // Flow: Repository updates -> Update or Create Draft Project
    return { success: true }; 
  }
}
