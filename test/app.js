const GroupApp = artifacts.require('AragonGroups.sol')

const EMPTY_ADDR = '0x0000000000000000000000000000000000000000'

contract('GroupApp', (accounts) => {
    let groupApp

    const root = accounts[0]
    const holder = accounts[1]
    const DUMMY_ROLE = 1


    before(async () => {
        //helper = await TestGroups.new()
    })

    beforeEach(async () => {
        groupApp = await GroupApp.new()
        groupApp.initialize()
    })

    describe('createGroup', async () => {

        it('increases lastFileId by 1 after addFile', async () => {            
            await groupApp.createGroup("fewa")
        })   

      
    })
})
