/** 与 electron skill-template 一致：去掉段末 param-中文 映射行，仅保留模板正文 */

const SECTION_HEADER = /^【(\w+)】\s*$/gm;
const PARAM_LABEL_LINE = /^([a-zA-Z][\w]*)-(.+)$/;

function stripSectionBodyParamLabels(body: string): string {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const paramLabels: string[] = [];
  let splitAt = lines.length;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]?.trim() ?? '';
    if (!line) {
      if (paramLabels.length > 0) {
        splitAt = i;
        break;
      }
      continue;
    }
    const m = PARAM_LABEL_LINE.exec(line);
    if (!m) {
      if (paramLabels.length > 0) {
        splitAt = i + 1;
      }
      break;
    }
    paramLabels.push(m[1]!);
    splitAt = i;
  }

  return lines
    .slice(0, splitAt)
    .join('\n')
    .trimEnd();
}

/** 去掉各分段末尾的 param-说明 行（编辑区只存/显模板） */
export function stripSkillPromptParamLabels(raw: string | null | undefined): string {
  const text = (raw ?? '').trim();
  if (!text) {
    return '';
  }

  const parts = text.split(SECTION_HEADER);
  if (parts.length === 1) {
    return stripSectionBodyParamLabels(parts[0]!);
  }

  const chunks: string[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i]?.trim();
    const body = parts[i + 1] ?? '';
    if (!key) {
      continue;
    }
    const stripped = stripSectionBodyParamLabels(body);
    chunks.push(`【${key}】\n${stripped}`.trimEnd());
  }
  return chunks.join('\n\n').trim();
}
