#!/usr/bin/env node
// PreToolUse guard: .env* files are never read, written or touched through a shell command.
// Only .env.example may change. Keys are the user's to manage.
'use strict';

const chunks = [];
process.stdin.on('data', (c) => chunks.push(c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return process.exit(0);
  }
  const tool = input.tool_name || '';
  const ti = input.tool_input || {};
  const deny = (reason) => {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }));
    process.exit(0);
  };
  const ENV_RE = /(^|[\\/])\.env(?!\.example$)[^\\/]*$/;
  const WHY = '.env 파일은 읽기·쓰기 금지. 사용자가 직접 관리한다. .env.example만 수정 가능 (CLAUDE.md 3절)';

  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String(ti.command || '');
    const withoutExample = cmd.replace(/\.env\.example/g, '');
    const touchesEnv = /\.env\b/.test(withoutExample);
    const readsOrWrites = /(cat|type|less|more|head|tail|sed|awk|grep|echo|printf|tee|cp|mv|Get-Content|Set-Content|Out-File|>|>>)/.test(withoutExample);
    if (touchesEnv && readsOrWrites) deny(WHY);
    return process.exit(0);
  }
  const file = ti.file_path || ti.path || ti.notebook_path || '';
  if (file && ENV_RE.test(file)) deny(WHY);
  process.exit(0);
});
