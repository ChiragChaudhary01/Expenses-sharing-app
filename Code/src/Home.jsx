import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setGoupName, addMember, removeMember } from './store/groupSlice';
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const group = useSelector((state) => state.group.groupName);
    const [member, setMember] = useState();
    const storeMembers = useSelector((state) => state.group.members);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChangeGroup = (e) => {
        dispatch(setGoupName(e.target.value));
    };

    const handleChangeMember = (e) => {
        setMember(e.target.value);
    };

    const handleAddMember = () => {
        if (!member || !member.trim()) return;
        dispatch(addMember(member));
        setMember("");
    };

    const handleMemberCancel = (index) => {
        dispatch(removeMember(index));
    }

    const handleCreateGroup = () => {
        console.log("Group Name:", group);
        console.log("Members:", storeMembers);
        navigate('/dashboard');
    }

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <div className='flex flex-col gap-7 bg-white p-5 rounded-2xl shadow w-130'>
                <div className='flex flex-col items-center gap-2'>
                    <h3>Create a Group</h3>
                    <p>Start sharing exprenses with friends and family.</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="group">Group Name</label>
                    <input type="text" name='group' value={group} onChange={handleChangeGroup} className='border rounded-2xl px-3 py-2 border-gray-400' placeholder='e.g. Weekend Trip' />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="member">Add Members</label>
                    <div className='flex gap-2 w-full'>
                        <input type="text" name='member' value={member} onChange={handleChangeMember} className='border rounded-2xl px-3 py-2 border-gray-400 w-full' placeholder='e.g. Chirag' />
                        <button className='bg-green-200 hover:bg-green-600 duration-200 font-medium py-0.5 px-3.5 rounded-2xl hover:cursor-pointer hover:scale-102' onClick={handleAddMember}>Add</button>
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        {storeMembers.map((member, index) => (
                            <div key={index} className='bg-gray-200 w-fit px-3 rounded-2xl flex gap-3 justify-center items-center'>
                                {member}
                                <span className='text-2xl pb-1 hover:font-medium hover:cursor-pointer font-light' onClick={() => handleMemberCancel(index)}>×</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <button className='bg-green-600 duration-150 py-1.5 w-full px-3.5 rounded-2xl hover:cursor-pointer hover:scale-102 font-medium' onClick={handleCreateGroup}>Create Group</button>
                </div>
            </div>
        </div>
    )
}

export default Home
