import { Subject, useSubjectInstance } from "@/components/Subject/src";
import React, { useEffect, useMemo, useState } from "react";
import { SelectContext, SelectContextInterface } from "./context";
import { clone, equals } from "ramda";
import { SelectItem, SelectItemProps } from "./selectItem";

export interface SelectInstance {
    /** 触发选中 */
    triggerSelect(selectedValue: any): void;
}

export interface SelectOption {
    /** reactKey diff算法用的 */
    key?: React.Key;
    node: SelectItemProps["children"];
    value: any;
}

export interface SelectProps {
    mode?: "single" | "multiple";
    /** 重复触发,取消选中状态，针对单选有效 */
    repeatTriggerUnselected?: boolean;
    /** 用来动态初始化选中值 */
    selectedValue?: any;
    onChange?(selectedValue: any): void;
    instance: SelectInstance;
    options: SelectOption[];
}

export const Select: React.FC<SelectProps> = (props) => {
    const {
        options,
        selectedValue,
        onChange,
        repeatTriggerUnselected = true,
        mode = "single",
        instance,
    } = props;
    const [_, update] = useState({});
    const subjectInstance = useSubjectInstance();
    const context = useMemo<SelectContextInterface>(() => {
        const selectItemMap = new Map();
        const selectItemValueMap = new Map();
        const triggerMap = {
            single(selectedValue) {
                let selectedId;
                if (typeof selectedValue === "object") {
                    for (let [value, id] of selectItemValueMap) {
                        if (equals(value, selectedValue)) {
                            selectedId = id;
                            break;
                        }
                    }
                } else {
                    selectedId = selectItemValueMap.get(selectedValue);
                }
                for (let [key, item] of selectItemMap) {
                    if (key === selectedId) {
                        if (repeatTriggerUnselected) {
                            if (item.isChecked) {
                                item.isChecked = false;
                            } else {
                                item.isChecked = true;
                            }
                        } else {
                            item.isChecked = true;
                        }
                        if (onChange) {
                            onChange(
                                item?.isChecked ? clone(item.value) : undefined
                            );
                        }
                    } else if (selectedId) {
                        item.isChecked = false;
                    }
                }
                update({});
            },
            multiple(selectedValue) {
                selectedValue?.forEach((value: any) => {
                    for (let [v, id] of selectItemValueMap) {
                        let selectedItem;
                        if (typeof value === "object" && equals(v, value)) {
                            selectedItem = selectItemMap.get(id);
                        } else if (value === v) {
                            selectedItem = selectItemMap.get(id);
                        }
                        if (selectedItem) {
                            if (selectedItem.isChecked) {
                                selectedItem.isChecked = false;
                            } else {
                                selectedItem.isChecked = true;
                            }
                            subjectInstance.send(id, undefined);
                            break;
                        }
                    }
                });
                if (onChange) {
                    const selectValues: any = [];
                    selectItemMap.forEach((item) => {
                        if (item.isChecked) {
                            selectValues.push(item.value);
                        }
                    });
                    onChange(clone(selectValues));
                }
            },
        };
        if (typeof instance === "object" && instance) {
            Object.assign(instance, {
                triggerSelect(selectedValue: any) {
                    triggerMap[mode]?.(selectedValue);
                },
            });
        }
        return {
            selectItemMap,
            selectItemValueMap,
        };
    }, []);

    useEffect(() => {
        const { selectItemMap } = context;
        const initSelectedValueMap = {
            single() {
                selectItemMap.forEach((item, key) => {
                    if (equals(item.value, selectedValue)) {
                        item.isChecked = true;
                        subjectInstance.send(key, undefined);
                    } else {
                        item.isChecked = false;
                    }
                });
            },
            multiple() {
                selectedValue?.forEach((item: any) => {
                    for (let [key, i] of selectItemMap) {
                        if (equals(i.value, item)) {
                            i.isChecked = true;
                            subjectInstance.send(key, undefined);
                            break;
                        }
                    }
                });
            },
        };
        initSelectedValueMap[mode]();
    }, [selectedValue]);
    return (
        <SelectContext.Provider value={context}>
            <Subject instance={subjectInstance}>
                {options.map((item, index) => (
                    <SelectItem value={item.value} key={item.key ?? index}>
                        {item.node}
                    </SelectItem>
                ))}
            </Subject>
        </SelectContext.Provider>
    );
};