import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from './AuthCheck';

const SignOut = () => {
    const { user, logOut } = UserAuth(); //user.uid
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await logOut()
            // navigate('/');
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
    if (user == null) {
        navigate('/');
    }
    }, [user]);

    return (
    <div>
        {user?.displayName ? (
        <button onClick={handleSignOut}>Sign Out</button>
        ) : (
        <Link to='/'>Sign in</Link>
        )}
    </div>
    );
};

export default SignOut;