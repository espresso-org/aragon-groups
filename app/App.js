import React from 'react'
import { AragonApp, AppBar, Button } from '@aragon/ui'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { GroupsScreen } from './components/groups-screen'
import { EditPanel } from './components/edit-panel'
import { LoadingRing } from './components/loading-ring'

export const App =
  inject("mainStore")(
    observer(({ mainStore }) =>
      <AppContainer publicUrl="/groups">
        <Main>
          <span>
            <AppBar title="Groups" endContent={<Button mode="strong" onClick={() => mainStore.setEditMode(EditMode.GroupCreate)}>New Group</Button>} />
            {mainStore.groupsLoadingfalse ? (
              <StyledLoadingRing />
            ) : (
              <GroupsScreen />
            )}
            <EditPanel />
          </span>
        </Main>
      </AppContainer>)
  )

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledLoadingRing = styled(LoadingRing)`
  vertical-align: middle;
  text-align: center;
  margin: 0 auto;
`
const Main = styled.div`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`