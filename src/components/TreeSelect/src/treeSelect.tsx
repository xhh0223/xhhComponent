import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TreeSelectContext } from "./context";
import { TreeSelectItem, TreeSelectItemProps } from "./treeSelectItem";
import { Subject, useSubjectInstance } from "@/components/Subject/src";
import { clone, equals } from "ramda";

export interface TreeSelectInstance {
    /** 触发选中 */
    triggerSelect(value: any): void;
}

export interface TreeSelectOption {
    key?: React.Key;
    node: TreeSelectItemProps["children"];
    value: any;
    childrenOptions?: TreeSelectOption[];
    // | (() => TreeSelectOption[]);
}

export interface TreeSelectProps {
    mode?: "single" | "cascader-single";
    instance: TreeSelectInstance;
    options: TreeSelectOption[];
    /** 重复触发,取消选中状态，针对单选有效 */
    repeatTriggerUnselected?: boolean;
    /** 触发选中时展开子选项 */
    triggerExpandChildren?: boolean;
    selectedValue?: any;
    onChange?(v: any): void;
}

export const TreeSelect: React.FC<TreeSelectProps> = (props) => {
    const {
        mode = "single",
        options,
        instance,
        selectedValue,
        onChange,
        repeatTriggerUnselected = true,
        triggerExpandChildren = false,
    } = props;
    const [_, setUpdate] = useState({});
    const subjectInstance = useSubjectInstance();
    const context = useMemo(() => {
        const treeSelectItemMap = new Map();
        const treeSelectItemValueMap = new Map();
        Object.assign(instance, {
            triggerSelect(value) {
                const treeSelectModeMap = {
                    single(v) {
                        let selectValueId;
                        if (typeof v === "object") {
                        } else {
                            selectValueId = treeSelectItemValueMap.get(v);
                        }
                        for (let [id, item] of treeSelectItemMap) {
                            if (id === selectValueId) {
                                if (repeatTriggerUnselected) {
                                    item.isChecked = !item.isChecked;
                                } else {
                                    item.isChecked = true;
                                }
                                if (onChange) {
                                    onChange(
                                        item.isChecked
                                            ? clone(item.value)
                                            : undefined
                                    );
                                }
                            } else {
                                item.isChecked = false;
                            }
                        }
                        if (selectValueId) {
                            setUpdate({});
                        }
                    },
                    ["cascader-single"](v) {
                        console.log(v);
                    },
                };
                treeSelectModeMap[mode](value);
            },
        });
        return {
            treeSelectItemMap,
            treeSelectItemValueMap,
        };
    }, []);
    const GenTreeSelect = useCallback(
        (props: { options: TreeSelectOption[] }) => {
            const { options } = props;
            const [_, setUpdate] = useState({});
            const state = useMemo(() => {
                return new Proxy(
                    {
                        displayCascaderChildrenOptions: false,
                    },
                    {
                        set(target, p) {
                            setUpdate({});
                            return target[p];
                        },
                    }
                );
            }, []);
            return options.map((item, index) => (
                <React.Fragment key={item.key ?? index}>
                    <TreeSelectItem
                        value={item.value}
                        childrenOptions={item.childrenOptions}
                    >
                        {item.node}
                    </TreeSelectItem>
                    {mode === "single" &&
                        Array.isArray(item.childrenOptions) &&
                        triggerExpandChildren === false &&
                        !!item.childrenOptions.length && (
                            <GenTreeSelect options={item.childrenOptions} />
                        )}
                    {mode === "cascader-single" &&
                        triggerExpandChildren === false &&
                        state.displayCascaderChildrenOptions &&
                        Array.isArray(item.childrenOptions) &&
                        !!item.childrenOptions.length && (
                            <GenTreeSelect options={item.childrenOptions} />
                        )}
                </React.Fragment>
            ));
        },
        [options]
    );
    useEffect(() => {
        if (typeof selectedValue === "object") {
            for (let [id, item] of context.treeSelectItemMap) {
                if (equals(item.value, selectedValue)) {
                    item.isChecked = true;
                    subjectInstance.send(id, undefined);
                    break;
                }
            }
        } else {
            const selectedId =
                context.treeSelectItemValueMap.get(selectedValue);
            const selectedItem = context.treeSelectItemMap.get(selectedId);
            if (selectedItem) {
                selectedItem.isChecked = true;
                subjectInstance.send(selectedId, undefined);
            }
        }
    }, []);
    return (
        <Subject instance={subjectInstance}>
            <TreeSelectContext.Provider value={context}>
                <GenTreeSelect options={options} />
            </TreeSelectContext.Provider>
        </Subject>
    );
};