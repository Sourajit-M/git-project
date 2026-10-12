export const groqPrompts = {
  commitMessage(diff: string, format = 'conventional', scope?: string, additionalContext?: string): { system: string; user: string } {
    const system = `You are an expert Git and DevOps assistant specializing in creating production-grade commit messages.
You follow the Conventional Commits specification strictly:
<type>[optional scope]: <description>

[optional body with bullet points]

[optional footer(s)]

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
Format preference: ${format}.
Scope requested: ${scope || 'auto-detect from diff'}.

Return ONLY valid JSON matching this schema:
{
  "title": "<type>(<scope>): <summary>",
  "body": "- <bullet point 1>\\n- <bullet point 2>",
  "primaryMessage": "<title>\\n\\n<body>",
  "type": "<feat|fix|refactor|etc>",
  "scope": "<scope>",
  "breakingChange": <true|false>,
  "alternatives": ["<alt 1>", "<alt 2>", "<alt 3>"],
  "explanation": "<brief rationale of why these changes were grouped>"
}`;

    const user = `Analyze this Git diff and generate a clean commit message:

${additionalContext ? `Additional Developer Context: ${additionalContext}\n\n` : ''}
Git Diff:
\`\`\`diff
${diff.slice(0, 8000)}
\`\`\``;

    return { system, user };
  },

  pullRequest(diff: string, baseBranch: string, compareBranch: string, templateType: string, customInstructions?: string): { system: string; user: string } {
    const system = `You are a staff software engineer creating pull request documentation.
Target Base Branch: ${baseBranch}
Comparing Head Branch: ${compareBranch}
Template Style: ${templateType}

Return ONLY valid JSON matching this schema:
{
  "title": "<Concise PR title>",
  "summary": "<High-level 2-3 sentence overview of changes>",
  "changes": ["<Bullet 1>", "<Bullet 2>"],
  "rationale": "<Architectural rationale and why this is needed>",
  "testingSteps": ["<Testing checklist item 1>", "<Testing checklist item 2>"],
  "markdown": "<Full ready-to-paste markdown description covering ## Summary, ## Changes Made, ## Rationale, and ## Testing & Verification checklists>"
}`;

    const user = `Generate a structured PR description from this diff:

${customInstructions ? `Special Instructions: ${customInstructions}\n\n` : ''}
Diff:
\`\`\`diff
${diff.slice(0, 10000)}
\`\`\``;

    return { system, user };
  },

  releaseNotes(commitsList: string, version: string, previousVersion?: string, audience = 'developers'): { system: string; user: string } {
    const system = `You are an open-source maintainer and release manager.
Create release notes and a changelog for version ${version} (previous: ${previousVersion || 'initial'}).
Target Audience: ${audience}.

Return ONLY valid JSON matching this schema:
{
  "version": "${version}",
  "releaseTitle": "Release ${version} — <High-level highlight>",
  "features": ["<feature 1>", "<feature 2>"],
  "fixes": ["<fix 1>", "<fix 2>"],
  "improvements": ["<improvement 1>"],
  "breakingChanges": [],
  "rawMarkdown": "<Complete formatted GitHub release markdown with emojis, categorized headings, and credit>"
}`;

    const user = `Compile these commits into structured release notes:

Commits:
\`\`\`
${commitsList.slice(0, 10000)}
\`\`\``;

    return { system, user };
  },
};
