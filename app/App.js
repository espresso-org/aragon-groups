import React from 'react'
import { AragonApp, AppBar, Button } from '@aragon/ui'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { Screen } from './components/screen'
import { GroupsScreen } from './components/groups-screen'
import { EditPanel } from './components/edit-panel'
import { LoadingRing } from './components/loading-ring'

export const App =
  inject("mainStore")(
    observer(({ mainStore }) =>
      <AppContainer publicUrl="/groups">
        <Screen position={0} animate>
          <span>
            <AppBar endContent={<Button mode="strong" onClick={() => mainStore.setEditMode(EditMode.GroupCreate)}>New Group</Button>}>
              <h1 style={{ lineHeight: 1.5, fontSize: "22px" }}>Groups</h1>
            </AppBar>
            {mainStore.groupsLoadingfalse ? (
              <StyledLoadingRing />
            ) : (
              <GroupsScreen />
            )}
            <EditPanel />
          </span>
        </Screen>
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