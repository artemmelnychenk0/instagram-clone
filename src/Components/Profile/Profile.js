/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { auth } from "../Data/firebase-config";
import userPic from '../assets/user.png'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";

import { db } from "../Data/firebase-config";
import { collection, getDocs, setDoc, doc, query, where } from 'firebase/firestore'
import { storage } from "../Data/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Profile = ({ toPost }) => {

    const [name, setName] = useState()
    const [picture, setPicture] = useState(userPic)
    const [posts, setPosts] = useState([])
    const [caption, setCaption] = useState('')
    const [selectedImg, setSelectedImg] = useState(null)
    const [userSigned, setUserSigned] = useState(false)


    useEffect(() => {
        // getPosts()
        onAuthStateChange()
    }, []);

    const navigate = useNavigate();

    const getPosts = async () => {
        const q = query(collection(db, 'posts'), where('name', '==', `${auth.currentUser.displayName}`))
        const data = await getDocs(q);
        // console.log(data.docs)
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const createPost = async (e) => {
        e.preventDefault()
        const timestamp = Date.now();
        //save Img
        const filePath = `${auth.currentUser.displayName}/images/${selectedImg.name}`
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
                            likes: 0,
                            comments: [{
                                user: '',
                                comment: '',
                                time: ''
                            }]
                        })

                    })
            })

    }

    function onAuthStateChange() {
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


    return (
        <div>

            <div>
                <div className="avatar" >
                    <img src={picture} alt='avatar' className="avatarpic" />
                    <div className="avatarname">{name}</div>
                </div>
                <br />
                <Popup trigger={<button className="plus">+</button>} position="right center"
                    modal
                    nested>
                    <form className="popup" onSubmit={createPost}>
                        <h2>Create new Post</h2>
                        <input type="file" id="pic" name="pic" accept="image/png, image/jpeg" onChange={(e) => { setSelectedImg(e.target.files[0]) }}></input>
                        <textarea type='text' placeholder="Caption" onChange={(e) => { setCaption(e.target.value) }} />
                        <button>Create Post</button>
                    </form>
                </Popup>

                <div className="posts" >
                    {userSigned && posts.map((post) => {
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
        </div>
    )
}
export default Profile