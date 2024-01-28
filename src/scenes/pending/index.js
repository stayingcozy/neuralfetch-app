import { useState } from 'react';

import styles from '../../Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostCreation from '../../components/PostCreation';
import { db, auth } from '../../lib/firebase';
import getMonthDayYear from '../../lib/getMonthDayYear';
// import SignOutButton from '../../components/SignOutButton';

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form'; // keep track of form inputs, and if form is valid,invalid
import ReactMarkdown from 'react-markdown'; // markdown notation for post
import toast from 'react-hot-toast';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ServerDataFetch from '../../components/ServerDataFetch';
import CaddyDataFetch from '../../components/CaddyDataFetch';
//

export default function UserProfilePage(props) {

  // get date
  const todaysDate = getMonthDayYear();

  // get stripe public key
  const stripePromise = loadStripe(
    'pk_test_51NBRQVIdyxz3uazIYnk5wpqkkj2S8PGvR3kFNnGO5fSqgBd1W6irb4pcdcTVzoCfkC8pexeOeVC9AbEun9Kcaxql00cX3NgyTD'
  );

  const [srcURL, setSrcURL] = useState('');
  const [httpsSrcURL, setHttpsSrcURL] = useState('');


  return (
    <main>
        {/* <AuthCheck> */}
          {/* <URLCheck> */}
            <Elements stripe={stripePromise}>

              <ServerDataFetch setSrcURL={setSrcURL} />
              <div className="videoWrapper">
                <iframe width="1280" height="720" src={srcURL} allowFullScreen></iframe>
              </div>
              <CaddyDataFetch setHttpsSrcURL={setHttpsSrcURL} />
              <div className="videoWrapper">
                <iframe width="1280" height="720" src={httpsSrcURL} allowFullScreen></iframe>
              </div>

              {/* <DailyActivityChart /> */}
              
              {/* <PostCreation date={todaysDate} />
              <PostManager date={todaysDate} />   */}
            </Elements>
          {/* </URLCheck> */}

          {/* <SignOutButton /> */}
        {/* </AuthCheck> */}
    </main>
  )
}


function PostManager({ date }) {
  const [preview, setPreview] = useState(false);

  const uid = auth.currentUser.uid;

  // since the user was authenticated, we can just grab it
  const postRef = doc(db,'users',`${uid}`,'posts',`${date}`);

  const [post] = useDocumentData(postRef); // real time - listen to the host
  //const [post] = useDocumentDataOnce(postRef); // only need read once to post the form

  return (
  <main className={styles.container}>
      {post && (
      <>
          <section>
          <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
          <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
          </aside>
      </>
      )}
  </main>
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
      <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown> 
      </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>

      <textarea name="content" {...register("content",
              {maxLength: { value: 20000, message: 'content is too long' }},
              {minLength: { value: 10, message: 'content is too short' }},
              {required: { value: true, message: 'content is required'}}
          )}></textarea>
      {errors.content && <p className="text-danger">{errors.content.message}</p>}

      <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
      </button>
      </div>
  </form>
  );
}