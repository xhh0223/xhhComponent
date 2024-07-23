import { AnchorID } from '@src/constant'
import { useScreen_max1200 } from '@src/hooks/media'
import { Nav } from '@src/layout'
import { RouterPath } from '@src/router'
import { Anchor, Flex } from 'antd'
import classNames from 'classnames'
import { useEffect } from 'react'
import { EventBusItem } from 'react-logic-component'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { MobileMenu } from './mobile-menu'
import { SideMenu } from './side-menu'

const Index = () => {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if ([RouterPath.component, RouterPath.root, RouterPath.document].includes(pathname as RouterPath)) {
      return navigate(`${RouterPath.selectSingle}${hash}`)
    } else if (!Object.values(RouterPath).includes(pathname as RouterPath)) {
      return navigate(`${RouterPath.selectSingle}${hash}`)
    }
  }, [pathname])

  const large = useScreen_max1200()

  return (
    <div className="container">
      <Nav mobileMenu={<MobileMenu />} />
      <Flex className="container-content">
        <SideMenu />
        <Flex
          flex={1}
          style={{
            overflow: 'auto',
            position: 'relative',
            boxSizing: 'border-box',
            padding: '0 16px 100px 16px',
          }}
        >
          <div style={{ height: 'fit-content', flexGrow: '1' }}>
            <Outlet />
          </div>
          <div className={classNames(!large && 'is-hidden', 'anchor-container')}>
            <EventBusItem
              id={AnchorID.component}
              key={AnchorID.component}
              onIds={[AnchorID.component]}
              render={({ onIdsParams, handler }) => {
                return onIdsParams?.length ? (
                  <Anchor
                    onClick={(_, linkInfo) => {
                      handler.emit(
                        // @ts-ignore
                        onIdsParams[0].params?.map((i) => ({
                          id: i.key,
                          params: { isActive: linkInfo.href === i.href },
                        })),
                      )
                    }}
                    items={onIdsParams[0].params as any}
                  />
                ) : null
              }}
            />
          </div>
        </Flex>
      </Flex>
    </div>
  )
}

export default Index
