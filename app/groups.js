export class Groups {

    constructor(aragonApp) {
        this._app = aragonApp
    }

    /**
     * Creates a new group of entities
     * @param {string} groupName Name of the group
     */
    async createGroup(groupName) {
        await this._initialize()

        await this._app.createGroup(groupName)
    }

    /**
     * Deletes a group
     * @param {number} groupId Id of the group
     */
    async deleteGroup(groupId) {
        await this._initialize()

        await this._app.deleteGroup(groupId)
    }

    /**
     * Rename an existing group
     * @param {number} groupId Id of the group to rename
     * @param {string} newGroupName New group name
     */
    async renameGroup(groupId, newGroupName) {
        await this._initialize()

        await this._app.renameGroup(groupId, newGroupName)
    }

    /**
     * Returns an array of all the groups infos
     */
    async getGroups() {
        await this._initialize()

        let groups = []
        const groupCount = await this._app.groupCount()
        for (var i = 1; i <= groupCount; i++) {
            let groupInfos = await this._app.getGroup(i)
            if (groupInfos && groupInfos[1] !== 0) {
                let group = {
                    id: i,
                    name: groupInfos[1],
                    entities: groupInfos[0].filter(entity => entity !== EMPTY_ADDRESS)
                }
                groups.push(group)
            }
        }
        return groups
    }    
}