import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import Switch from 'literal-switch'
import { SidePanel } from '@aragon/ui'

import { EditGroupCreate } from './edit-group-create'
import { EditGroupName } from './edit-group-name'
import { EditGroupMember } from './edit-group-member'
import { EditMode } from '../stores/edit-mode'

function title(editMode) {
  switch (editMode) {
    case EditMode.None: return ''
    case EditMode.GroupCreate: return 'Create Group'
    case EditMode.GroupName: return 'Rename Group'
    case EditMode.GroupMember: return 'Add Member'
  }
  return ''
}

export const EditPanel =
  inject("mainStore")(
    observer(({ mainStore }) =>
      <SidePanel
        title={title(mainStore.editMode)}
        opened={mainStore.editMode !== EditMode.None}
        onClose={() => { mainStore.editMode = EditMode.None; mainStore.fileUploadIsOpen = false; mainStore.fileContentIsOpen = false; }}
      >
        <Content>
          {(mainStore.selectedFile || mainStore.isGroupsSectionOpen || mainStore.fileUploadIsOpen || mainStore.fileContentIsOpen) &&
        Switch({
          [EditMode.None]: null,
          [EditMode.GroupCreate]: () => <EditGroupCreate />,
          [EditMode.GroupName]: () => <EditGroupName group={mainStore.selectedGroup} />,
          [EditMode.GroupMember]: () => <EditGroupMember group={mainStore.selectedGroup} />,
        }, mainStore.editMode)}
        </Content>
      </SidePanel>)
  )

const Content = styled.div`
  margin-top: 20px;
`