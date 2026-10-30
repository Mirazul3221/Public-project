import { suburl } from '@/app/config';
import { useStore } from '@/app/global/DataProvider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AddAndDeleteFriendRequestButton from '../../components/messanger/components/AddAndDeleteFriendRequestButton';

const LikedContainer = ({ feedData }) => {
    const { store, dispatch } = useStore();
    const [friends, setFriends] = useState([]);
    const fetchData = async () => {
        try {
            const { data } = await axios.post(
                `${suburl}/user-reaction/liked-user`, { data: feedData.data },
                {
                    headers: {
                        Authorization: `Bearer ${store.token}`,
                    },
                }
            );
            setFriends(data)
            if (data.length == 0)dispatch({ type: "CLOSE_LIKED_CONTAINER" });
        } catch (error) {
        dispatch({ type: "CLOSE_LIKED_CONTAINER" });
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-black/50 fixed top-0 left-0 z-[999]'>
            <button onClick={() => {
                dispatch({ type: "CLOSE_LIKED_CONTAINER" });
            }} className='absolute top-4 right-10 hidden md:block'>Close</button>
            <button onClick={() => {
                dispatch({ type: "CLOSE_LIKED_CONTAINER" });
            }} className='absolute text-white top-4 left-10 md:hidden'>Close</button>
            <div className="md:w-1/3 w-full max-h-[80vh] bg-white p-5">
             {
               friends && friends?.map(item=>{
                    return (
                        <div key={item._id} className="flex justify-between items-center my-3">
                          <div className="flex gap-3">
                              <div className="w-12 h-12">
                                <img className='w-full h-full rounded-full' src={item?.profile} alt={item.nmae} />
                              </div>
                              <div className="text-gray-700">
                                <h2 className='font-bold'>{item.name} <sup className='text-violet-600'>({item.status})</sup></h2>
                                 <p className='text-sm'>{item.title}</p>
                              </div>
                             
                          </div>
                          <div>
                           <AddAndDeleteFriendRequestButton id={item._id} relStatus ={item?.relStatus}/>
                          </div>
                        </div>
                    )
                })
             }
            </div>
        </div>
    )
}

export default LikedContainer