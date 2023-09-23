import { type Id as tempId, type SelectItem as Item, type SelectedValue as Value } from '@/Select/src/typing'

export type Id = tempId

export type SelectItem<ValueType> = Item<ValueType> & {
  parentId: Id
  path: Id[]
  /** 当前选中值的层级 */
  level: number
  childrenIds: Id[]
}

export interface IContext<ValueType> {
  setSelectItem: (selectItemId: Id, selectItem: SelectItem<ValueType>) => void
  deleteSelectItem: (selectItemId: Id) => void
  getSelectItem: (selectItemId: Id) => SelectItem<ValueType> | undefined
  getAllSelectItem: () => Array<SelectItem<ValueType>>
}

export type SelectedValue<ValueType> = Value<ValueType> & {
  path: Id[]
  /** 当前选中值的层级 */
  level: number
  parentId: Id
  childrenIds: Id[]
}
