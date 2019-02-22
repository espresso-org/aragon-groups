const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

export class Groups {
    constructor(aragonApp) {
        this._app = aragonApp
    }

    /**
     * Creates a new group of entities
     * @param {string} groupName Name of the group
     */
    async createGroup(groupName) {
        await promise(this._app.createGroup(groupName))
    }

    /**
     * Deletes a group
     * @param {number} groupId Id of the group
     */
    async deleteGroup(groupId) {
        await promise(this._app.deleteGroup(groupId))
    }

    /**
     * Rename an existing group
     * @param {number} groupId Id of the group to rename
     * @param {string} newGroupName New group name
     */
    async renameGroup(groupId, newGroupName) {
        await promise(this._app.renameGroup(groupId, newGroupName))
    }

    /**
     * Returns an array of all the groups infos
     */
    async getGroups() {
        let groups = []
        const groupCount = await promise(this._app.call('groupCount'))
        for (var i = 0; i < groupCount; i++) {
            let groupInfos = await promise(this._app.call('getGroup', i))
            if (groupInfos && groupInfos[1] !== 0) {
                let group = {
                    id: i,
                    name: groupInfos[1],
                    entities: groupInfos.entities.filter(entity => entity !== EMPTY_ADDRESS)
                }
                groups.push(group)
            }
        }
        return groups
    }
    
    /**
     * Returns the entities from a group
     * @param {number} groupId Id of the group to get entities from
     */
    async getGroup(groupId) {
        return (await promise(this._app.call('getGroup', groupId)))
            .entities
            .filter(entity => entity !== EMPTY_ADDRESS)
    }

    /**
     * Add an entity to a group
     * @param {number} groupId Id of the group to insert the entity in
     * @param {string} entity Entity to add in group
     */
    async addEntityToGroup(groupId, entity) {
        await promise(this._app.addEntityToGroup(groupId, entity))
    }

    /**
     * Removes an entity from a group
     * @param {number} groupId Id of the group to remove the entity from
     * @param {string} entity Entity to remove from group
     */
    async removeEntityFromGroup(groupId, entity) {
        await promise(this._app.removeEntityFromGroup(groupId, entity))
    }   
    
    events() {
        return this._app.events()
    }
}

function promise(observable) {
    return observable.take(1).toPromise()
}