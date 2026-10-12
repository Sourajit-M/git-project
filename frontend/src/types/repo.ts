export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  isPrivate: boolean;
  defaultBranch: string;
  htmlUrl: string;
  language: string;
  starsCount: number;
  forksCount: number;
  updatedAt: string;
  openIssuesCount: number;
  branches: string[];
}

export interface DiffFile {
  filename: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  patch: string;
}

export interface GitDiffPayload {
  repoName: string;
  branch: string;
  compareBranch?: string;
  rawDiff: string;
  filesChanged?: number;
  insertions?: number;
  deletions?: number;
}
