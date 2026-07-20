const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'github_issues_data.json');

// Helper to execute terminal commands
function runCmd(command, printOutput = false) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: printOutput ? 'inherit' : 'pipe' });
    return output ? output.trim() : '';
  } catch (error) {
    if (error.stdout) return error.stdout.trim();
    throw error;
  }
}

function main() {
  console.log('🚀 Starting SETU GitHub Workspace Setup...');

  // 1. Verify gh CLI is installed and authenticated
  try {
    const version = runCmd('gh --version');
    console.log(`✅ GitHub CLI version: ${version.split('\n')[0]}`);
  } catch (err) {
    console.error('❌ Error: GitHub CLI ("gh") is not installed or not in PATH.');
    process.exit(1);
  }

  // 2. Load the issues database
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Error: Data file not found at ${DATA_FILE}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`✅ Loaded ${data.labels.length} labels, ${data.milestones.length} milestones, ${data.epics.length} epics, and ${data.issues.length} issues.`);

  // 3. Detect remote repository owner/name
  let repoOwner = 'tanish0320';
  let repoName = 'Setu';
  try {
    const remoteUrl = runCmd('git remote get-url origin');
    console.log(`📦 Remote Repository URL: ${remoteUrl}`);
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^.]+)/);
    if (match) {
      repoOwner = match[1];
      repoName = match[2];
      console.log(`✅ Identified Repository: ${repoOwner}/${repoName}`);
    }
  } catch (err) {
    console.warn(`⚠️ Warning: Could not detect repository owner/name from git remote. Defaulting to ${repoOwner}/${repoName}`);
  }

  // Check auth status
  try {
    runCmd('gh auth status');
    console.log('✅ GitHub CLI is authenticated.');
  } catch (err) {
    console.error('❌ Error: GitHub CLI is not authenticated. Please run "gh auth login" first.');
    process.exit(1);
  }

  // 4. Create Labels
  console.log('\n🏷️ Creating Labels...');
  for (const label of data.labels) {
    try {
      // Check if label exists first
      const exists = runCmd(`gh label list --search "${label.name}"`);
      if (exists.includes(label.name)) {
        console.log(`   Label "${label.name}" already exists. Skipping.`);
        continue;
      }
      runCmd(`gh label create "${label.name}" --color "${label.color}" --description "${label.description}"`);
      console.log(`   Created label: "${label.name}"`);
    } catch (err) {
      console.log(`   ⚠️ Failed to create label "${label.name}": ${err.message.split('\n')[0]}`);
    }
  }

  // 5. Create Milestones
  console.log('\n📅 Creating Milestones...');
  for (const ms of data.milestones) {
    try {
      const exists = runCmd('gh milestone list --state all');
      if (exists.includes(ms.title)) {
        console.log(`   Milestone "${ms.title}" already exists. Skipping.`);
        continue;
      }
      runCmd(`gh milestone create --title "${ms.title}" --description "${ms.description}"`);
      console.log(`   Created milestone: "${ms.title}"`);
    } catch (err) {
      console.log(`   ⚠️ Failed to create milestone "${ms.title}": ${err.message.split('\n')[0]}`);
    }
  }

  // 6. Create parent Epic Issues
  console.log('\n👑 Creating Epic Issues...');
  const epicMappings = {}; // key -> issue number
  const epicNodes = {}; // key -> issue Node ID (for projects if needed)

  for (const epic of data.epics) {
    console.log(`   Creating Epic: ${epic.title}...`);
    
    // Assemble body
    let body = `# ${epic.title}\n\n`;
    body += `## 🎯 Objective\n${epic.objective}\n\n`;
    
    body += `## 📦 Key Deliverables\n`;
    for (const d of epic.deliverables) {
      body += `- [ ] ${d}\n`;
    }
    body += `\n`;
    
    body += `## 📊 Success Metrics\n${epic.successMetrics}\n\n`;
    
    body += `## 🛠️ Progress Checklist & Child Issues\n`;
    body += `<!-- CHILD_LIST_START -->\n`;
    body += `<!-- CHILD_LIST_END -->\n\n`;

    body += `## 🔄 Epic Status\n`;
    body += `- [ ] Product Specifications & Journey Mapping\n`;
    body += `- [ ] Database Schema Setup & Indexes\n`;
    body += `- [ ] Core Backend API Implementations\n`;
    body += `- [ ] Frontend Views & User Flows\n`;
    body += `- [ ] WebSockets Sync & Telemetry Hooks\n`;
    body += `- [ ] Code Review, QA, & Unit Testing\n`;

    const labelsStr = `epic,milestone:sprint-freeze`;
    let epicMilestone = 'Sprint 0 – Product Freeze';
    
    // Epic 1 is Sprint 0, others map based on their scope
    if (epic.key === 'EPIC-DOCTOR' || epic.key === 'EPIC-HOSPITAL' || epic.key === 'EPIC-SECURITY') {
      epicMilestone = 'Sprint 1 – MVP Foundation';
    } else if (epic.key === 'EPIC-REALTIME') {
      epicMilestone = 'Sprint 2 – Realtime Platform';
    } else if (epic.key === 'EPIC-CALENDAR') {
      epicMilestone = 'Sprint 3 – Unified Calendar';
    } else if (epic.key === 'EPIC-EMERGENCY') {
      epicMilestone = 'Sprint 4 – Emergency Coordination';
    } else if (epic.key === 'EPIC-MATCHING' || epic.key === 'EPIC-MAPS') {
      epicMilestone = 'Sprint 5 – Adaptive Matching Engine';
    } else if (epic.key === 'EPIC-UIUX') {
      epicMilestone = 'Sprint 6 – UX Polish';
    } else if (epic.key === 'EPIC-DEMO') {
      epicMilestone = 'Sprint 7 – Judge Demo';
    } else if (epic.key === 'EPIC-DOCUMENTATION') {
      epicMilestone = 'Sprint 8 – Production Readiness';
    } else if (epic.key === 'EPIC-STARTUP') {
      epicMilestone = 'Sprint 9 – Hospital Pilot';
    }

    try {
      const escapeBody = body.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
      const createCmd = `gh issue create --title "${epic.title}" --body "${escapeBody}" --milestone "${epicMilestone}" --label "epic"`;
      const issueUrl = runCmd(createCmd);
      const issueNum = issueUrl.split('/').pop();
      console.log(`      Created Epic Issue #${issueNum} URL: ${issueUrl}`);
      epicMappings[epic.key] = issueNum;
    } catch (err) {
      console.error(`      ❌ Failed to create Epic ${epic.title}:`, err.message);
    }
  }

  // 7. Create Child Issues
  console.log('\n📝 Creating Child Issues...');
  const childMappings = {}; // key -> issue number

  for (const issue of data.issues) {
    console.log(`   Creating Child Issue: ${issue.title} [${issue.key}]...`);
    const parentEpicNum = epicMappings[issue.epicKey];

    // Build the description checklist exactly as requested in Step 7
    let body = `# ${issue.title}\n\n`;
    body += `## 📋 Overview\n${issue.overview}\n\n`;
    body += `## 🎯 Problem Statement\n${issue.problemStatement}\n\n`;
    body += `## 👤 User Story\n\`\`\`text\n${issue.userStory}\n\`\`\`\n\n`;
    
    body += `## ⚙️ Technical Requirements\n`;
    for (const req of issue.technicalRequirements) {
      body += `- [ ] ${req}\n`;
    }
    body += `\n`;

    body += `## 🛠️ Implementation Tasks\n\n`;
    
    body += `### Database\n`;
    if (issue.implementationTasks.Database) {
      for (const t of issue.implementationTasks.Database) {
        body += `- [ ] ${t}\n`;
      }
    } else {
      body += `- [ ] Verify schema indexes and keys match model configurations\n`;
    }
    body += `\n`;

    body += `### Backend\n`;
    if (issue.implementationTasks.Backend) {
      for (const t of issue.implementationTasks.Backend) {
        body += `- [ ] ${t}\n`;
      }
    } else {
      body += `- [ ] Implement target REST / WebSocket events controllers\n`;
    }
    body += `\n`;

    body += `### Frontend\n`;
    if (issue.implementationTasks.Frontend) {
      for (const t of issue.implementationTasks.Frontend) {
        body += `- [ ] ${t}\n`;
      }
    } else {
      body += `- [ ] Build design-compliant React layout views\n`;
    }
    body += `\n`;

    body += `### Testing\n`;
    if (issue.implementationTasks.Testing) {
      for (const t of issue.implementationTasks.Testing) {
        body += `- [ ] ${t}\n`;
      }
    } else {
      body += `- [ ] Write automated unit tests covering logic methods\n`;
      body += `- [ ] Validate integration endpoints\n`;
    }
    body += `\n`;

    body += `### Documentation\n`;
    if (issue.implementationTasks.Documentation) {
      for (const t of issue.implementationTasks.Documentation) {
        body += `- [ ] ${t}\n`;
      }
    } else {
      body += `- [ ] Annotate target DTO interfaces using Swagger properties\n`;
    }
    body += `\n`;

    body += `### QA\n`;
    body += `- [ ] Perform manual verification checks on UI containers\n`;
    body += `- [ ] Verify validation errors and boundary inputs\n\n`;

    body += `## 🧪 Acceptance Criteria\n`;
    for (const ac of issue.acceptanceCriteria) {
      body += `- [ ] ${ac}\n`;
    }
    body += `\n`;

    body += `## 🔗 Dependencies\n`;
    body += `Requires: ${issue.dependencies}\n`;
    if (parentEpicNum) {
      body += `Parent Epic: #${parentEpicNum}\n`;
    }
    body += `\n`;

    body += `## 📊 Telemetry\n`;
    body += `- **Priority**: ${issue.priority}\n`;
    body += `- **Story Points**: ${issue.storyPoints} SP\n`;
    body += `- **Milestone**: ${issue.milestone}\n`;
    body += `- **Estimated Time**: ${issue.estimatedTime}\n`;

    // Format labels parameter for gh CLI
    const labelsParam = issue.labels.concat([issue.priority]).join(',');
    
    try {
      const escapeBody = body.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
      const createCmd = `gh issue create --title "${issue.title}" --body "${escapeBody}" --milestone "${issue.milestone}" --label "${labelsParam}"`;
      const issueUrl = runCmd(createCmd);
      const issueNum = issueUrl.split('/').pop();
      console.log(`      Created Issue #${issueNum} URL: ${issueUrl}`);
      childMappings[issue.key] = issueNum;
      
      // Keep track in parent Epic mapping
      if (parentEpicNum) {
        if (!epicMappings[issue.epicKey + '_children']) {
          epicMappings[issue.epicKey + '_children'] = [];
        }
        epicMappings[issue.epicKey + '_children'].push({ num: issueNum, title: issue.title });
      }
    } catch (err) {
      console.error(`      ❌ Failed to create Issue ${issue.title}:`, err.message);
    }
  }

  // 8. Update Epic Issue Descriptions to list Child Issues
  console.log('\n🔗 Linking Child Issues to Epic parent bodies...');
  for (const epic of data.epics) {
    const parentNum = epicMappings[epic.key];
    const children = epicMappings[epic.key + '_children'] || [];
    if (!parentNum || children.length === 0) continue;

    console.log(`   Updating Epic #${parentNum} description...`);
    try {
      // Fetch current body
      const issueDetailsJson = runCmd(`gh issue view ${parentNum} --json body`);
      const currentBody = JSON.parse(issueDetailsJson).body;
      
      let childrenText = '';
      for (const child of children) {
        childrenText += `- [ ] #${child.num} — ${child.title}\n`;
      }

      const updatedBody = currentBody.replace(
        '<!-- CHILD_LIST_START -->\n<!-- CHILD_LIST_END -->',
        `<!-- CHILD_LIST_START -->\n${childrenText}<!-- CHILD_LIST_END -->`
      );

      const escapeBody = updatedBody.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
      runCmd(`gh issue edit ${parentNum} --body "${escapeBody}"`);
      console.log(`      Linked ${children.length} child issues to Epic #${parentNum}`);
    } catch (err) {
      console.error(`      ❌ Failed to update Epic #${parentNum}:`, err.message);
    }
  }

  // 9. Generate Discussions
  console.log('\n💬 Creating GitHub Discussions...');
  let repositoryId = '';
  try {
    // Fetch Repository GraphQL Node ID
    const repoDetails = runCmd(`gh api graphql -f query="query { repository(owner:\\"${repoOwner}\\", name:\\"${repoName}\\") { id } }"`);
    const repoDetailsObj = JSON.parse(repoDetails);
    repositoryId = repoDetailsObj.data.repository.id;
    console.log(`   Repository GraphQL ID: ${repositoryId}`);
  } catch (err) {
    console.warn('   ⚠️ Could not fetch Repository GraphQL ID. Skipping discussion creation.', err.message);
  }

  if (repositoryId) {
    // Fetch category IDs
    let categories = [];
    try {
      const categoriesJson = runCmd(`gh api graphql -f query="query { repository(owner:\\"${repoOwner}\\", name:\\"${repoName}\\") { discussionCategories(first:10) { nodes { id name } } } }"`);
      const categoriesObj = JSON.parse(categoriesJson);
      categories = categoriesObj.data.repository.discussionCategories.nodes;
      console.log(`   Fetched ${categories.length} discussion categories.`);
    } catch (err) {
      console.warn('   ⚠️ Could not query discussion categories.', err.message);
    }

    if (categories.length > 0) {
      for (const disc of data.discussions) {
        // Map data discussion category to repository categories
        // Find best match category
        let targetCategory = categories.find(c => c.name.toLowerCase().includes(disc.category.toLowerCase()) || disc.category.toLowerCase().includes(c.name.toLowerCase()));
        // Fallback to first category (usually General or Q&A)
        if (!targetCategory) targetCategory = categories[0];

        console.log(`   Creating Discussion: "${disc.title}" in category "${targetCategory.name}"...`);
        try {
          const queryStr = `mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
            createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
              discussion {
                url
              }
            }
          }`;

          const escapeTitle = disc.title.replace(/"/g, '\\"');
          const escapeBody = disc.body.replace(/"/g, '\\"').replace(/\n/g, '\\n');

          const variablesJson = JSON.stringify({
            repositoryId: repositoryId,
            categoryId: targetCategory.id,
            title: escapeTitle,
            body: escapeBody
          }).replace(/"/g, '\\"');

          const createDiscCmd = `gh api graphql -f query="${queryStr.replace(/\n/g, ' ')}" -f variables="${variablesJson}"`;
          const result = runCmd(createDiscCmd);
          const resultObj = JSON.parse(result);
          console.log(`      Created Discussion URL: ${resultObj.data.createDiscussion.discussion.url}`);
        } catch (err) {
          console.log(`      ⚠️ Failed to create discussion. Discussions might be disabled in your repository settings: ${err.message.split('\n')[0]}`);
        }
      }
    }
  }

  console.log('\n🏁 SETU GitHub Workspace Setup completed successfully!');
}

main();
