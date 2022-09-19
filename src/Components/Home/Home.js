import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../Data/firebase-config"


const Home = () => {
    const [posts, setPosts] = useState([])


    useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        const collectionRef = collection(db, 'posts')
        const q = query(collectionRef, orderBy('time', 'desc'))
        const data = await getDocs(q);
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    return (
        <div>
            <h3>Home Page</h3>
            <div>
                {posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <h1>Name: {post.name}</h1>
                            <h1>Post: {post.caption}</h1>
                            <img src={post.imageUrl} alt='imagePost' />
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
export default Home