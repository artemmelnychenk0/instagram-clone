import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../Data/firebase-config"

const Post = ({ post }) => {

    const [posts, setPosts] = useState()

    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        const docRef = doc(db, 'posts', `${post}`)
        const docSnap = await getDoc(docRef)
        // const q = query(collection(db, "posts"), where("time", "==", post));
        // const data = await getDocs(q);
        console.log(docSnap.data())
        setPosts(docSnap.data());
        // setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const updateLikes = async (id, likes) => {
        const userDoc = doc(db, 'posts', id);
        const likeIncr = { likes: likes + 1 };
        await updateDoc(userDoc, likeIncr)
    }

    const deletePost = async (id) => {
        const userDoc = doc(db, 'posts', id)
        await deleteDoc(userDoc)
    }

    const addComment = async (id) => {
    }

    return (
        <div>
            <div>Post</div>
            <div>{post}</div>

            <div key={posts.id} className='single'>
                <h1>Name: {posts.name}</h1>
                <h1>Post: {posts.caption}</h1>
                <img src={posts.imageUrl} alt='imagePost' />
                <h1>Likes: {posts.likes}</h1>
                <h2>Comment: {posts.comments[1]}</h2>
                <button
                    onClick={() => {
                        updateLikes(posts.id, posts.likes)
                    }}>Like
                </button>
                <button onClick={() => {
                    deletePost(post.id)
                }}>
                    Delete
                </button>
            </div>
        </div>
    )
}
export default Post