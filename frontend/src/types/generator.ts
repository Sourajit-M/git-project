export type CommitFormat = 'conventional' | 'gitmoji' | 'concise' | 'detailed';

export interface CommitGenerateRequest {
  diff: string;
  repoName?: string;
  format?: CommitFormat;
  includeScope?: boolean;
  scope?: string;
  additionalContext?: string;
}

export interface CommitGenerateResponse {
  primaryMessage: string;
  title: string;
  body?: string;
  type: string;
  scope?: string;
  breakingChange: boolean;
  alternatives: string[];
  explanation: string;
  modelUsed: string;
  cachedInRedis?: boolean;
}

export interface PrGenerateRequest {
  title?: string;
  diff: string;
  baseBranch: string;
  compareBranch: string;
  templateType: 'feature' | 'bugfix' | 'refactor' | 'full';
  customInstructions?: string;
}

export interface PrGenerateResponse {
  title: string;
  summary: string;
  changes: string[];
  rationale: string;
  testingSteps: string[];
  breakingChanges?: string[];
  markdown: string;
  modelUsed: string;
  cachedInRedis?: boolean;
}

export interface ReleaseNotesRequest {
  version: string;
  previousVersion?: string;
  commitsList: string;
  includeStats?: boolean;
  audience: 'developers' | 'users' | 'stakeholders';
}

export interface ReleaseNotesResponse {
  version: string;
  releaseTitle: string;
  features: string[];
  fixes: string[];
  improvements: string[];
  breakingChanges: string[];
  rawMarkdown: string;
  generatedDate: string;
  modelUsed: string;
  cachedInRedis?: boolean;
}

export type GenerationType = 'commit' | 'pr' | 'release';

export interface GenerationHistoryItem {
  id: string;
  type: GenerationType;
  title: string;
  preview: string;
  timestamp: string;
  cached: boolean;
  repoName?: string;
  metadata?: Record<string, any>;
  fullOutput: string;
}
