import React,{useState, useEffect} from 'react';
import axios from '../../axios/axios'
import { useDispatch } from 'react-redux';
import {setName,setEmail,setPhoneNumber} from '../../store/userSlice/userSlice'
function Profile() {
    const [user, setUser] = useState({})
    const dispatch = useDispatch()
    const fetchUser = async () => {
        try {
            const res = await axios.get('/client/')
            setUser(res.data.user)
            dispatch(setName(user.fullname))
            dispatch(setEmail(user.email))
            dispatch(setPhoneNumber(user.phone))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">User Profile</h2>
                <table className="min-w-full ">
                    <tbody>
                        <tr>
                            <td className="text-leftpx-4 py-2  font-semibold">Name:</td>
                            <td className="px-4 py-2">{user.fullname}</td>
                        </tr>
                        <tr>
                            <td className="text-leftpx-4 py-2  font-semibold">Email:</td>
                            <td className="px-4 py-2">{user.email}</td>
                        </tr>
                        <tr>
                            <td className="text-leftpx-4 py-2  font-semibold">Phone Number:</td>
                            <td className="px-4 py-2">{user.phone||'no phone number'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Profile;
