import { observable, action, configure,  } from 'mobx'
import { EditMode } from './edit-mode'

configure({ isolateGlobalState: true })

export class MainStore {
  @observable editMode = EditMode.None

  @observable isGroupsSectionOpen = false

  @observable groups = []

  @observable selectedGroup

  @observable selectedGroupEntity

  @observable groupsLoading = false

  _groups

  constructor(groups) {
    this._groups = groups
    window.mainStore = this
  }

  @action setEditMode(mode) {
    this.editMode = mode
  }

  @action async createGroup(name) {
    if (name) {
      await this._groups.createGroup(name)
      this.setEditMode(EditMode.None)
    }
  }

  @action async deleteGroup(groupId) {
    if (this.selectedGroup != null) {
      await this._groups.deleteGroup(groupId)
      this.setEditMode(EditMode.None)
      this.selectedGroup = null
    }
  }

  @action async renameGroup(groupId, newGroupName) {
    if (newGroupName) {
      await this._groups.renameGroup(groupId, newGroupName)
      this.setEditMode(EditMode.None)
    }
  }

  @action async addEntityToGroup(groupId, entity) {
    if (this.validateEthAddress(entity)) {
      await this._groups.addEntityToGroup(groupId, entity)
      this.setEditMode(EditMode.None)
    }
  }

  @action async removeEntityFromGroup(groupId, entity) {
    await this._groups.removeEntityFromGroup(groupId, entity)
    this.selectedGroupEntity = null
  }

  isGroupSelected(group) {
    return this.selectedGroup && this.selectedGroup.id === group.id
  }

  selectGroup = async (groupId) => {
    if (this.selectedGroup && this.selectedGroup.id === groupId) {
      this.selectedGroupEntity = null
      this.selectedGroup = null
      return this.selectedGroup
    }

    const selectedGroup = this.groups.find(group => group && group.id === groupId)
    if (selectedGroup) {
      this.selectedGroupEntity = null
      this.selectedGroup = selectedGroup
    }
    return null
  }

  isGroupEntitySelected(entity) {
    return this.selectedGroupEntity && this.selectedGroupEntity === entity
  }

  selectGroupEntity = async (entity) => {
    if (entity !== this.selectedGroupEntity)
      this.selectedGroupEntity = entity
    else
      this.selectedGroupEntity = null;
  }

  async initialize() {
    return new Promise(async (res) => {
      (await this._groups.events()).subscribe((event) => {
        switch (event.event) {
          case 'GroupChange':
            this._refreshAvailableGroups()
            break
        }
      });

      this._refreshAvailableGroups()
      res()
    })
  }

  async _refreshAvailableGroups() {
    this.groupsLoading = true
    this.groups = await this._datastore.getGroups()

    if (this.selectedGroup)
      this.selectedGroup = this.groups.find(group => group && group.id === this.selectedGroup.id)
    this.groupsLoading = false
  }

  validateEthAddress(address) {
    return address && new RegExp('0[xX][0-9a-fA-F]+').test(address)
  }
}