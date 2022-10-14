/* eslint-disable react-hooks/exhaustive-deps */
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../Data/firebase-config"
import { auth } from "../Data/firebase-config";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {

    const [posts, setPosts] = useState([])
    const [comment, setComment] = useState('')
    const [postLoaded, setPostLoaded] = useState(false)
    const [updatePage, setUpdatePage] = useState(1)

    const navigate = useNavigate();

    useEffect(() => {
        getPosts()
    }, [updatePage])

    const getPosts = async () => {
        const docRef = doc(db, 'posts', `${post}`);
        const docSnap = await getDoc(docRef);
        setPosts(docSnap.data());
        setPostLoaded(true)
    }

    const addComment = async (event) => {
        const timestamp = Date.now();
        event.preventDefault()
        const docRef = doc(db, 'posts', `${post}`)
        await updateDoc(docRef,
            {
                comments: arrayUnion({
                    comment: `${comment}`,
                    time: `${timestamp}`,
                    user: auth.currentUser.displayName
                })
            }
        )
        setUpdatePage(updatePage + 1)


    }

    const updateLikes = async () => {
        // const timestamp = Date.now();
        const docRef = doc(db, 'posts', `${post}`)
        console.log(posts.likes)
        if (posts.likes.filter(e => e.user === auth.currentUser.displayName).length > 0) {
            await updateDoc(docRef,
                {
                    likes: arrayRemove({
                        like: 1,
                        user: auth.currentUser.displayName
                    })
                })
        } else {
            await updateDoc(docRef,
                {
                    likes: arrayUnion({
                        like: 1,
                        user: auth.currentUser.displayName
                    })
                }
            )
        }
        setUpdatePage(updatePage + 1)


    }

    const deletePost = async (id) => {
        const userDoc = doc(db, 'posts', id)
        await deleteDoc(userDoc)
        navigate('/profile')

    }

    return (
        <div>
            {postLoaded &&
                <div key={posts.id} className='single'>
                    <h1>Name: {posts.name}</h1>
                    <h1>Post: {posts.caption}</h1>
                    <img src={posts.imageUrl} alt='imagePost' />
                    <h1>Likes: {posts.likes.length}</h1>

                    <div>
                        {posts.comments.map(comment => {
                            return (
                                <div key={comment.time}>
                                    Comment by: {comment.user}
                                    <br></br>
                                    {comment.comment}
                                </div>
                            )
                        })}
                    </div>
                    <button
                        onClick={() => {
                            updateLikes()
                        }}>Like
                    </button>
                    <button onClick={() => {
                        deletePost(post)
                    }}>
                        Delete
                    </button>
                    <div>
                        <form onSubmit={addComment}>
                            <h2>Add comment</h2>
                            <textarea type='text' placeholder="Caption" onChange={(e) => { setComment(e.target.value) }} />
                            <br></br>
                            <button>Create</button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}
export default Post