interface TreeNode {
    id: string;
    children?: TreeNode[];
}

//传入树型数据和id返回id下方的所有数据
export function getAllIdsUnderNode(tree: TreeNode[], targetId: string): string[] {
    const result: string[] = [];

    function findNodeAndCollectIds(node: TreeNode) {
        if (node.id === targetId) {
            collectIds(node);
        } else if (node.children) {
            for (const child of node.children) {
                findNodeAndCollectIds(child);
            }
        }
    }

    function collectIds(node: TreeNode) {
        result.push(node.id);
        if (node.children) {
            for (const child of node.children) {
                collectIds(child);
            }
        }
    }

    for (const node of tree) {
        findNodeAndCollectIds(node);
    }
    return result;
}


//传入树型数据和id返回上级带下级
export function getAllRelatedIds(tree: TreeNode[], targetId: string): any {
    const childIds: string[] = [];
    let parentIds: string[] = [];

    function collectChildIds(node: TreeNode) {
        childIds.push(node.id);
        if (node.children) {
            for (const child of node.children) {
                collectChildIds(child);
            }
        }
    }

    function findNodeAndCollectIds(node: TreeNode, currentPath: string[]): boolean {
        currentPath.push(node.id);

        if (node.id === targetId) {
            collectChildIds(node);
            parentIds = currentPath.slice(0, -1); // Exclude the target node itself
            return true;
        }

        if (node.children) {
            for (const child of node.children) {
                if (findNodeAndCollectIds(child, currentPath)) {
                    return true;
                }
            }
        }

        currentPath.pop();
        return false;
    }

    for (const node of tree) {
        if (findNodeAndCollectIds(node, [])) {
            break;
        }
    }

    return [...childIds, ...parentIds];
}
