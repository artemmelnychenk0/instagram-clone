/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import { auth } from "../Data/firebase-config";
import userPic from '../assets/user.png'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";

import { db } from "../Data/firebase-config";
import { collection, getDocs, setDoc, doc, query, where, updateDoc, getDoc } from 'firebase/firestore'
import { storage } from "../Data/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";


const Profile = ({ toPost }) => {

    const [name, setName] = useState()
    const [picture, setPicture] = useState(userPic)
    const [posts, setPosts] = useState([])
    const [caption, setCaption] = useState('')
    const [selectedImg, setSelectedImg] = useState(null)
    const [avatarChange, setAvatarChange] = useState(null)
    const [nameChange, setNameChange] = useState('')
    const [userSigned, setUserSigned] = useState(false)
    const [userInfo, setUserInfo] = useState()



    const inputRef = useRef(null)


    useEffect(() => {
        onAuthStateChange()
    }, []);

    useEffect(() => {
        getUserInfo()
    }, [])

    const navigate = useNavigate();

    const getPosts = async () => {
        const q = query(collection(db, 'posts'), where('email', '==', `${auth.currentUser.email}`))
        const data = await getDocs(q);
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const getUserInfo = async () => {
        const userId = auth.currentUser.reloadUserInfo.localId
        const docRef = doc(db, 'users', `${userId}`)
        const docSnap = await getDoc(docRef);
        setUserInfo(docSnap.data())
        console.log(userInfo.followers.length) //not loading at the time
    }

    const createPost = async (e) => {
        e.preventDefault()
        const timestamp = Date.now();
        //save Img
        const filePath = `${auth.currentUser.email}/images/${selectedImg.name}`
        const imageRef = ref(storage, filePath)

        //upload image and caption to db
        await uploadBytes(imageRef, selectedImg)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        setDoc(doc(db, 'posts', `${timestamp}`), {
                            caption: caption,
                            name: `${auth.currentUser.displayName}`,
                            imageUrl: url,
                            time: timestamp,
                            likes: [],
                            comments: [],
                            email: auth.currentUser.email
                        })
                    })
            })
        navigate('/home')

    }

    const updateNames = async () => {
        const q = query(collection(db, 'posts'), where('email', '==', `${auth.currentUser.email}`))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docs) => {
            const docRef = doc(db, 'posts', `${docs.id}`)
            updateDoc(docRef,
                {
                    name: nameChange
                })
        })
    }

    const updateUser = async (e) => {
        e.preventDefault();

        const filePath = `${auth.currentUser.email}/images/avatar/${avatarChange.name}`
        const imageRef = ref(storage, filePath)

        await uploadBytes(imageRef, avatarChange)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        updateProfile(auth.currentUser, {
                            displayName: nameChange, photoURL: url
                        })
                    })
            })
            .then(() => {
                updateNames()
                navigate('/home')
            }).catch((err) => {
                console.log(err)
            })
    }

    const onAuthStateChange = () => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                setName(user.displayName)
                setPicture(user.photoURL)
                setUserSigned(true)
                getPosts()

            } else {
                setName('user')
                setPicture(userPic)
                setUserSigned(false)
            }
        })
    }

    const handleClick = () => {
        inputRef.current.click()
    }

    return (
        <div>
            {userSigned &&
                <div>
                    <div className="avatar" >
                        <img src={picture} alt='avatar' className="avatarpic" />
                        <div className="avatarname">{name}</div>
                        {/* <div>Followers:{userInfo.followers.length}</div>
                        <div>UserName: {userInfo.username}</div>
                        <div>{userInfo.bio}</div> */}
                    </div>
                    <br />
                    <Popup trigger={<button className="plus">+</button>} position="right center"
                        modal
                        nested>
                        <form className="popup" onSubmit={createPost}>
                            <h2>Create new Post</h2>
                            <input type="file" id="pic" name="pic" accept="image/png, image/jpeg" onChange={(e) => { setSelectedImg(e.target.files[0]) }}></input>
                            <textarea type='text' placeholder="Caption" onChange={(e) => { setCaption(e.target.value) }} />
                            <button type="submit">Create Post</button>
                        </form>
                    </Popup>
                    <Popup trigger={<button>Edit Profile</button>} position="right center"
                        modal
                        nested>
                        <form onSubmit={updateUser}>
                            <h2>Edit your profile</h2>
                            <div className="avatar" >
                                <img src={picture} alt='avatar' className="avatarpic" onClick={handleClick} />
                                <input style={{ display: 'none' }} type="file" ref={inputRef} id="pic" name="pic" accept="image/png, image/jpeg" onChange={(e) => { setAvatarChange(e.target.files[0]) }}></input>
                            </div>
                            <input type='text' placeholder="Caption" onChange={(e) => { setNameChange(e.target.value) }} />
                            <button type="submit">Save</button>
                        </form>
                    </Popup>

                    <div className="posts" >
                        {posts.map((post) => {
                            return (
                                <div key={post.id} className='single' onClick={() => {
                                    toPost(post.id);
                                    navigate(`/post/${post.id}`)
                                }}>
                                    <img src={post.imageUrl} alt='imagePost' />
                                </div>
                            )
                        })}
                    </div>

                </div>
            }
        </div>
    )
}
export default Profile