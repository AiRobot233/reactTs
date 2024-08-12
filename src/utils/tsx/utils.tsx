import * as Icons from "@ant-design/icons";
import React from "react";

//递归替换图标为组件
export function replaceIcons(data) {
    return data.map(item => {
        // 替换当前项的 icon
        const updatedItem = { ...item, icon: getIconComponent(item.icon) };
        // 如果有子项（children），递归替换
        if (updatedItem.children) {
            updatedItem.children = replaceIcons(updatedItem.children);
        }
        return updatedItem;
    });
}

// 根据图标名称获取对应的图标组件
function getIconComponent(iconName) {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent/> : null;
}