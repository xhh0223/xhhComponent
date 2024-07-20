import { Flex } from 'antd'
import { useRef, useState } from 'react'

import { SelectSingle, SelectSingleHandler, SelectSingleItem } from '~react-logic-component'
const Demo3 = () => {
  const [state, setState] = useState({
    currentValue: undefined,
  })
  const ref = useRef<SelectSingleHandler>()

  return (
    <Flex component={'article'} vertical gap={12}>
      <div className="is-bold">select</div>

      <Flex component={'section'} vertical gap={12}>
        <SelectSingle ref={ref}>
          <select
            name="select"
            onChange={(v) => {
              const id = Number(v.currentTarget.value)
              const values = ref.current.select(id)
              setState({ currentValue: values })
            }}
          >
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <SelectSingleItem
                  key={index}
                  id={index}
                  value={index}
                  render={({ id, value }) => <option label={`第${value}项`} value={id} />}
                />
              )
            })}
          </select>
        </SelectSingle>
        <Flex vertical gap={8}>
          <div>选项状态：</div>
          <div>{JSON.stringify(state.currentValue)}</div>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Demo3
