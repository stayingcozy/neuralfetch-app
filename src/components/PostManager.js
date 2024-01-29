import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form'; // keep track of form inputs, and if form is valid,invalid
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown'; // markdown notation for post
import styles from '../Admin.module.css';
import { db } from '../lib/firebase';
import { UserAuth } from './AuthCheck';
import { Box } from "@mui/material";

export default function PostManager({ date }) {
    const [preview, setPreview] = useState(false);

    const { user, logOut } = UserAuth();
    const uid = user.uid;
  
    // const uid = auth.currentUser.uid;
  
    // since the user was authenticated, we can just grab it
    const postRef = doc(db,'users',`${uid}`,'posts',`${date}`);
  
    const [post] = useDocumentData(postRef); // real time - listen to the host
    //const [post] = useDocumentDataOnce(postRef); // only need read once to post the form
  
    return (
    // <main className={styles.container}>
    <Box>
        {post && (
        <>
            {/* <section> */}
            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
            {/* </section> */}
  
            {/* <aside> */}
            <div>
            <h2>Tools</h2>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            {/* </aside> */}
            </div>
        </>
        )}
    </Box>
    // {/* </main> */}
    );
  }
  
  function PostForm({ defaultValues, postRef, preview }) {
    // isDirty means the user interacted with it
    const { register, handleSubmit, reset, watch, formState: {isValid, isDirty, errors} } = useForm({ defaultValues, mode: 'onChange' });
  
    const updatePost = async ({ content }) => {
    await updateDoc(postRef,{
        content,
        updatedAt: serverTimestamp(),
    });
  
    reset({ content });
  
    toast.success('Feedback Sent!')
    };
  
    // watch() the content and render in markdown
  
    return (
    <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
        <Box>
            <ReactMarkdown>{watch('content')}</ReactMarkdown> 
        {/* </div>         // <div className="card"> */}
        </Box>
        )}
  
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
        {/* <div className={preview ? styles.hidden : styles.controls}> */}
        
        <textarea 
            name="content" 
            {...register("content",
            {maxLength: { value: 20000, message: 'content is too long' }},
            {minLength: { value: 10, message: 'content is too short' }},
            {required: { value: true, message: 'content is required'}}
            )}
            style={{ resize: 'none', width: '100%', height: '100%', flexGrow: 1, boxSizing: 'border-box' }}
        ></textarea>
        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
            Save Changes
        </button>
        {/* </div> */}
    </Box>
    </form>
    );
  }