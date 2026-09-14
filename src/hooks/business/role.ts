/**
 * 权限相关 hooks（模板态 stub：一律放行）
 * 真实 privilege 已从本模板移除；勿依赖此行为做安全边界。
 */
export function useRole() {
  const hasMenuPrivilege = (_pathPrivilege?: string) => true;

  const judgePrivilege = (_pathPrivilege?: string, _requiredType?: 'read' | 'write') => true;

  const judgeHierarchyPrivilege = (_hierarchy?: string) => true;

  const judgeStoreHierarhPrivilege = () => true;

  const judgeProxyHierarhPrivilege = () => true;

  const getBoRoleList = async () => undefined;
  const getBoRoleInfoById = async (_boRoleId?: string) => undefined;
  const createCopyRole = async (_data?: unknown) => undefined;
  const refreshBoRoleInfos = async () => undefined;
  const handlePrivilegeTreeNodeIcon = () => [];
  const judgeNodeIconType = (_path?: string): [string, string] => ['none', 'none'];

  return {
    getBoRoleList,
    getBoRoleInfoById,
    createCopyRole,
    refreshBoRoleInfos,
    hasMenuPrivilege,
    judgePrivilege,
    handlePrivilegeTreeNodeIcon,
    judgeNodeIconType,
    judgeHierarchyPrivilege,
    judgeStoreHierarhPrivilege,
    judgeProxyHierarhPrivilege
  };
}
