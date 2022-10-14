
import { useState } from "react";
import { auth, db } from "../Data/firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const SignIn = () => {

    const [userInput, setUserInput] = useState('')

    const navigate = useNavigate()

    const changeHandler = (e) => {
        setUserInput(e.target.value)
    }
    const login = async () => {

        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
            .then(() => {
                navigate('/profile')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const signUp = async (e) => {
        e.preventDefault()

        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user
                const userId = user.reloadUserInfo.localId
                setDoc(doc(db, 'users', `${userId}`), {
                    email: user.email,
                    followers: [],
                    folowing: [],
                    bio: `Hi my name is ${user.displayName}`,
                    username: userInput
                })
                navigate('/profile')
            })
            .catch((err) => {
                console.log(err)
            })
    }



    return (
        <div>
            <h3>Sign Up</h3>
            <form onSubmit={signUp}>

                <input type='text' placeholder='username' required minLength='3' onChange={changeHandler} name='username'></input>
                <br></br>
                <button>Sign Up With Google</button>
            </form>
            <p> Already signed up?</p>
            <button onClick={login}>Login</button>
        </div>
    )
}
export default SignIn
