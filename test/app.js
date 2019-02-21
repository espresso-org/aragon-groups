const CounterApp = artifacts.require('CounterApp.sol')
const DAOFactory = artifacts.require('@aragon/core/contracts/factory/DAOFactory')
const EVMScriptRegistryFactory = artifacts.require('@aragon/core/contracts/factory/EVMScriptRegistryFactory')
const ACL = artifacts.require('@aragon/core/contracts/acl/ACL')
const Kernel = artifacts.require('@aragon/core/contracts/kernel/Kernel')

const EMPTY_ADDR = '0x0000000000000000000000000000000000000000'

contract('GroupApp', (accounts) => {
    let datastore
    let daoFact
    let acl
    let kernel
    let kernelBase
    let aclBase
    let APP_MANAGER_ROLE
    let helper

    const root = accounts[0]
    const holder = accounts[1]
    const DUMMY_ROLE = 1
    const gasTracker = new GasTracker()

    before(async () => {
        aclBase = await ACL.new()        
        kernelBase = await Kernel.new(true)
        helper = await TestDatastore.new()
    })

    beforeEach(async () => {
        
        const regFact = await EVMScriptRegistryFactory.new()
        daoFact = await DAOFactory.new(kernelBase.address, aclBase.address, regFact.address)        

        const r = await daoFact.newDAO(root)
        kernel = Kernel.at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
        acl = ACL.at(await kernel.acl())         
        
        APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()

        await acl.createPermission(holder, kernel.address, APP_MANAGER_ROLE, holder, { from: root })

        const receipt = await kernel.newAppInstance(await helper.apmNamehash("datastore"), (await Datastore.new()).address, { from: holder })        
        datastore = Datastore.at(receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy)

        const daclReceipt = await kernel.newAppInstance(await helper.apmNamehash("datastore-acl"), (await ObjectACL.new()).address, { from: holder })        
        objectACL = ObjectACL.at(daclReceipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy)

        await acl.createPermission(datastore.address, objectACL.address, await objectACL.OBJECTACL_ADMIN_ROLE(), root)
        await acl.createPermission(root, datastore.address, await datastore.DATASTORE_MANAGER_ROLE(), root)
        await acl.createPermission(root, datastore.address, await datastore.EDIT_FILE_ROLE(), root)
        await acl.createPermission(root, datastore.address, await datastore.DELETE_FILE_ROLE(), root)

        await acl.grantPermission(holder, datastore.address, await datastore.DATASTORE_MANAGER_ROLE())
        await acl.grantPermission(holder, datastore.address, await datastore.EDIT_FILE_ROLE())
        
        
        await objectACL.initialize() 
        await datastore.initialize(objectACL.address)

        await acl.grantPermission(objectACL.address, acl.address, await acl.CREATE_PERMISSIONS_ROLE())
    })

    describe('addGroup', async () => {

        it('increases lastFileId by 1 after addFile', async () => {
            assert.equal(await datastore.lastFileId(), 0)
            await datastore.addFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", 0)
            assert.equal(await datastore.lastFileId(), 1)
        })   

      
    })
})
