import { readFileSync, writeFileSync } from 'fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME || 'mag123c';
const README_PATH = 'README.md';

// nestjs만 2depth (repo별 분류)
const TWO_DEPTH_ORGS = ['nestjs'];

// 블랙리스트 (owner/repo 형식)
const BLACKLIST_REPOS = [
  'microsoft/TypeScript',
  'ts-backend-meetup-ts/meetup',
  'weekly-academy/members',
  'sil-0908/Goott-2nd-Project',
  'jmcho2010/gunchim',
  // toktrack 자기 홍보용 awesome 리스트 등재 (기여 아님, 트래킹 제외)
  'rust-unofficial/awesome-rust',
  'agarrharr/awesome-cli-apps',
];

// 상태 이모지
const STATUS_EMOJI = {
  merged: '✅',
  open: '🔄',
  closed: '❌',
};

async function fetchAllPRs() {
  const prs = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const query = encodeURIComponent(`author:${USERNAME} type:pr is:public`);
    const url = `https://api.github.com/search/issues?q=${query}&per_page=${perPage}&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'oss-contribution-tracker',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    prs.push(...data.items);

    if (data.items.length < perPage) break;
    page++;
  }

  return prs;
}

async function getPRDetails(pr) {
  // PR URL에서 owner/repo 추출
  const match = pr.html_url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;

  const [, owner, repo, number] = match;

  // 내 레포 제외
  if (owner.toLowerCase() === USERNAME.toLowerCase()) return null;

  // 블랙리스트 레포 제외
  if (BLACKLIST_REPOS.includes(`${owner}/${repo}`)) return null;

  // PR 상세 정보 가져오기 (merged 여부 확인)
  const prUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;
  const response = await fetch(prUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'oss-contribution-tracker',
    },
  });

  if (!response.ok) return null;

  const prData = await response.json();

  let status;
  if (prData.merged_at) {
    status = 'merged';
  } else if (prData.state === 'open') {
    status = 'open';
  } else {
    status = 'closed';
  }

  return {
    owner,
    repo,
    number: parseInt(number),
    title: pr.title,
    status,
    url: pr.html_url,
  };
}

function parseReadme(content) {
  const sections = {};
  const orgOrder = [];
  const lines = content.split('\n');

  let currentOrg = null;
  let currentRepo = null;
  let inContributions = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Open Source Contributions 섹션 시작
    if (line.includes('## 📖 Open Source Contributions')) {
      inContributions = true;
      continue;
    }

    // 다른 ## 섹션 만나면 종료
    if (inContributions && line.startsWith('## ') && !line.includes('Open Source Contributions')) {
      break;
    }

    if (!inContributions) continue;

    // org 헤더: ### [nestjs](...)
    const orgMatch = line.match(/^### \[([^\]]+)\]\(([^)]+)\)/);
    if (orgMatch) {
      currentOrg = orgMatch[1];
      currentRepo = null;
      if (!sections[currentOrg]) {
        sections[currentOrg] = { url: orgMatch[2], repos: {}, prs: [] };
        orgOrder.push(currentOrg);
      }
      continue;
    }

    // repo 헤더 (2depth): [**nest**](...)
    const repoMatch = line.match(/^\s*\[\*\*([^\*]+)\*\*\]\(([^)]+)\)/);
    if (repoMatch && currentOrg) {
      currentRepo = repoMatch[1];
      if (!sections[currentOrg].repos[currentRepo]) {
        sections[currentOrg].repos[currentRepo] = { url: repoMatch[2], prs: [] };
      }
      continue;
    }

    // PR 항목: - ✅ ... [#123](...)
    const prMatch = line.match(/^\s*-\s*(✅|🔄|❌)\s*(.+?)\s*\[#(\d+)\]\(([^)]+)\)/u);
    if (prMatch && currentOrg) {
      const prInfo = {
        status: prMatch[1],
        description: prMatch[2].replace(/:$/, '').trim(),
        number: parseInt(prMatch[3]),
        url: prMatch[4],
      };

      if (currentRepo && sections[currentOrg].repos[currentRepo]) {
        sections[currentOrg].repos[currentRepo].prs.push(prInfo);
      } else {
        sections[currentOrg].prs.push(prInfo);
      }
    }
  }

  return { sections, order: orgOrder };
}

function buildOrgKey(owner, repo) {
  // README 패턴:
  // - nestjs/* → nestjs (2depth)
  // - nodejs/node → nodejs (특수 케이스)
  // - prisma/prisma → prisma (org === repo)
  // - typeorm/typeorm → typeorm (org === repo)
  // - grafana/loki → loki (repo명만 사용)
  // - google-gemini/gemini-cli → gemini-cli (repo명만 사용)
  // - daangn/ventyd → ventyd (repo명만 사용)

  // nestjs는 2depth org
  if (TWO_DEPTH_ORGS.includes(owner)) {
    return owner;
  }

  // nodejs/node 특수 케이스
  if (owner === 'nodejs' && repo === 'node') {
    return 'nodejs';
  }

  // org === repo면 org만 표시
  if (owner === repo) {
    return owner;
  }

  // 그 외는 repo명만 사용
  return repo;
}

function buildOrgUrl(owner, repo, orgKey) {
  // org만 표시하는 경우도 URL은 실제 repo 경로로
  if (TWO_DEPTH_ORGS.includes(owner)) {
    return `https://github.com/${owner}`;
  }
  return `https://github.com/${owner}/${repo}`;
}

function cleanPRTitle(title) {
  // conventional commit 스타일 prefix 제거
  // 예: "fix(Slack Trigger Node): Fix user ignore filter" → "Fix user ignore filter"
  // 예: "feat: Add new feature" → "Add new feature"
  if (title.includes(':')) {
    return title.split(':').slice(1).join(':').trim();
  }
  return title;
}

function generateContributionsSection(sections, order) {
  let output = '## 📖 Open Source Contributions\n\n';

  for (const orgKey of order) {
    const orgData = sections[orgKey];
    if (!orgData) continue;

    output += `### [${orgKey}](${orgData.url})\n`;

    // 2depth org (nestjs)
    if (TWO_DEPTH_ORGS.some(o => orgKey.toLowerCase() === o.toLowerCase())) {
      for (const [repoName, repoData] of Object.entries(orgData.repos)) {
        output += `  [**${repoName}**](${repoData.url})\n`;
        for (const pr of repoData.prs) {
          output += `  - ${pr.status} ${pr.description} [#${pr.number}](${pr.url})\n`;
        }
        output += '  \n';
      }
    } else {
      // 1depth org
      for (const pr of orgData.prs) {
        output += `- ${pr.status} ${pr.description} [#${pr.number}](${pr.url})\n`;
      }
      output += '\n';
    }
  }

  return output;
}

function mergeContributions(existing, newPRs, orgOrder) {
  const sections = JSON.parse(JSON.stringify(existing)); // deep clone
  const newOrgs = [];

  for (const pr of newPRs) {
    const orgKey = buildOrgKey(pr.owner, pr.repo);
    const isTwoDepth = TWO_DEPTH_ORGS.includes(pr.owner);
    const emoji = STATUS_EMOJI[pr.status];

    // org가 없으면 생성
    if (!sections[orgKey]) {
      sections[orgKey] = {
        url: buildOrgUrl(pr.owner, pr.repo, orgKey),
        repos: {},
        prs: [],
      };
      if (!orgOrder.includes(orgKey)) {
        newOrgs.push(orgKey);
      }
    }

    if (isTwoDepth) {
      // 2depth: repo별로 분류
      if (!sections[orgKey].repos[pr.repo]) {
        sections[orgKey].repos[pr.repo] = {
          url: `https://github.com/${pr.owner}/${pr.repo}`,
          prs: [],
        };
      }

      const repoPRs = sections[orgKey].repos[pr.repo].prs;
      const existingIdx = repoPRs.findIndex(p => p.number === pr.number);

      if (existingIdx >= 0) {
        // 상태만 업데이트 (기존 description 유지)
        repoPRs[existingIdx].status = emoji;
      } else {
        // 새 PR 추가
        repoPRs.push({
          status: emoji,
          description: cleanPRTitle(pr.title),
          number: pr.number,
          url: pr.url,
        });
      }
    } else {
      // 1depth
      const orgPRs = sections[orgKey].prs;
      const existingIdx = orgPRs.findIndex(p => p.number === pr.number);

      if (existingIdx >= 0) {
        // 상태만 업데이트 (기존 description 유지)
        orgPRs[existingIdx].status = emoji;
      } else {
        // 새 PR 추가
        orgPRs.push({
          status: emoji,
          description: cleanPRTitle(pr.title),
          number: pr.number,
          url: pr.url,
        });
      }
    }
  }

  // 순서 유지: 기존 org 순서 + 새 org
  const finalOrder = [...orgOrder, ...newOrgs];

  return { sections, order: finalOrder };
}

function updateReadme(content, newContributionsSection) {
  const startMarker = '## 📖 Open Source Contributions';
  const endPattern = /\n<br>\s*\n<br>/;

  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    // 섹션이 없으면 맨 위에 추가
    return newContributionsSection + '\n' + content;
  }

  const afterStart = content.substring(startIdx);
  const endMatch = afterStart.match(endPattern);

  if (endMatch) {
    const endIdx = startIdx + endMatch.index;
    return content.substring(0, startIdx) + newContributionsSection + content.substring(endIdx);
  }

  // 끝 마커 못 찾으면 전체 교체
  return content.substring(0, startIdx) + newContributionsSection + '\n\n<br>\n<br>\n';
}

async function main() {
  console.log('Fetching PRs from GitHub...');
  const allPRs = await fetchAllPRs();
  console.log(`Found ${allPRs.length} PRs total`);

  console.log('Getting PR details...');
  const prDetails = [];
  for (const pr of allPRs) {
    const details = await getPRDetails(pr);
    if (details) {
      prDetails.push(details);
      console.log(`  ${details.owner}/${details.repo}#${details.number} - ${details.status}`);
    }
  }
  console.log(`Found ${prDetails.length} OSS contribution PRs`);

  console.log('Reading README...');
  const readmeContent = readFileSync(README_PATH, 'utf-8');
  const { sections: existingSections, order: existingOrder } = parseReadme(readmeContent);

  console.log('Merging contributions...');
  const { sections: mergedSections, order: mergedOrder } = mergeContributions(
    existingSections,
    prDetails,
    existingOrder
  );

  console.log('Generating new section...');
  const newSection = generateContributionsSection(mergedSections, mergedOrder);

  console.log('Updating README...');
  const newReadme = updateReadme(readmeContent, newSection);
  writeFileSync(README_PATH, newReadme);

  console.log('Done!');
}

main().catch(console.error);
