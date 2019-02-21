pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract CounterApp is AragonApp {
    using SafeMath for uint256;

    /**
     * Represents a group and its entities within it   
     */
    struct Group {
        string groupName;
        mapping (address => uint) entitiesWithIndex;
        address[] entities;
        bool exists;
    }

    event GroupChange(uint256 groupId);

    Group[] private groups;
    uint256 public value;

    bytes32 constant public GROUP_MANAGER_ROLE = keccak256("GROUP_MANAGER_ROLE");
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");

    function initialize() onlyInit public {
        initialized();
    }

    /**
     * @notice Create a new group
     * @param _groupName Name of the group
     */
    function createGroup(string _groupName) 
        external 
        auth(GROUP_MANAGER_ROLE) 
    {
        uint256 index = groups.length++;
        groups[index].groupName = _groupName;
        groups[index].exists = true;
        emit GroupChange(index);
    }

    /**
     * @notice Delete a group
     * @param _groupId Id of the group to delete
     */
    function deleteGroup(uint256 _groupId) 
        external 
        auth(GROUP_MANAGER_ROLE) 
    {
        require(groups[_groupId].exists);
        delete groups[_groupId];
        emit GroupChange(_groupId);
    }

    /**
     * @notice Rename a group
     * @param _groupId Id of the group to rename
     * @param _newGroupName New name for the group
     */
    function renameGroup(uint256 _groupId, string _newGroupName) 
        external 
        auth(GROUP_MANAGER_ROLE) 
    {
        require(groups[_groupId].exists);
        groups[_groupId].groupName = _newGroupName;
        emit GroupChange(_groupId);
    }

    /**
     * @notice Get a specific group
     * @param _groupId Id of the group to return
     */
    function getGroup(uint256 _groupId) 
        external 
        view 
        returns (address[] entities, string name) 
    {        
        entities = groups[_groupId].entities;
        name = groups[_groupId].groupName;
    }

    /**
     * @notice Get a list of all the groups Id's
     */
     /*
    function getGroupIds() public view returns (uint[]) {
        return groups.groupList;
    }*/

    /**
     * @dev Returns the group count
     */
    function groupCount() 
        external 
        view 
        returns (uint256) 
    {
        return groups.length;
    }

    /**
     * @notice Add an entity to a group
     * @param _groupId Id of the group to add the entity in
     * @param _entity Address of the entity
     */
    function addEntityToGroup(uint256 _groupId, address _entity) 
        auth(GROUP_MANAGER_ROLE)
        external 
    {
        require(groups[_groupId].exists);
        groups[_groupId].entitiesWithIndex[_entity] = groups[_groupId].entities.length.add(1);
        groups[_groupId].entities.push(_entity);
        emit GroupChange(_groupId);
    }

    /**
     * @notice Remove an entity from a group
     * @param _groupId Id of the group to remove the entity from 
     * @param _entity Address of the entity
     */
    function removeEntityFromGroup(uint256 _groupId, address _entity) 
        auth(GROUP_MANAGER_ROLE)
        external 
    {
        uint indexOfEntity = groups[_groupId].entitiesWithIndex[_entity];
        if (indexOfEntity > 0) {
            indexOfEntity = indexOfEntity.sub(1);
            delete groups[_groupId].entities[indexOfEntity];
            delete groups[_groupId].entitiesWithIndex[_entity];
        }
    }

}
