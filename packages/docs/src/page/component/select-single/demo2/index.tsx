import { Flex } from 'antd'
import { useRef, useState } from 'react'

import { SelectSingle, SelectSingleHandler, SelectSingleItem } from '~react-logic-component'
const Demo2 = () => {
  const [state, setState] = useState({
    currentValue: undefined,
  })
  const ref = useRef<SelectSingleHandler>()

  return (
    <Flex component={'article'} vertical gap={12}>
      <div className="is-bold">radio(重复点击不可取消)</div>
      <Flex component={'section'} vertical gap={12}>
        <SelectSingle ref={ref}>
          <Flex vertical>
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <SelectSingleItem
                  key={index}
                  id={index}
                  value={index}
                  render={({ id, isChecked, value, handler }) => (
                    <Flex
                      onClick={() => {
                        const value = handler.select(id, { allowRepeatSelect: true })
                        setState({ currentValue: value })
                      }}
                    >
                      <div>{`第${value}项`}</div>
                      <input type="radio" checked={isChecked} onChange={() => {}} />
                    </Flex>
                  )}
                />
              )
            })}
          </Flex>
        </SelectSingle>
        <Flex vertical gap={8}>
          <div>选项状态：</div>
          <div>{JSON.stringify(state.currentValue)}</div>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Demo2
