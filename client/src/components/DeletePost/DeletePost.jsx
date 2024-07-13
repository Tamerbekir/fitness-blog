import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REMOVE_POST } from '../../../utils/mutations';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

// export function to delete a post, and using postId and refetch as parameters we are going to take in and pass through to the profile page
const DeletePost = ({ postId, refetch }) => {
  //remove post mutation, using onComplete to refetch function after a deletion is made in the database. Without this, database will not update. Then, general error handling
  const [removePost] = useMutation(REMOVE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Error removing post', error),
  })

  // deleteForm for useState that shows a confirm delete if user clicks on the delete button
  const [deleteForm, setDeleteForm] = useState(false)

  // function for deleting a post, taking in a single variable which we are passing in the postId as the id for the post. In other words, we can now define post._id as postId

  // the variable for a single post is id, not _id
  const handleDeletePost = async () => {
    try {
      // console.log("Deleting post with _id:", postId); // Debugging log
      await removePost({
        variables: {
          id: postId
        }
      });
      toast.success('Post deleted', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
      setDeleteForm(false);
    } catch (error) {
      toast.error('Error deleting post', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  };


  return (
    <div>
      {/* Do not show the delete confirm form, just show the delete button and setDeleteForm to true on button press- which means when the this button is pressed the deleteForm will show */}
      {!deleteForm && (
        <IconButton>
          <DeleteIcon className='deletePostBtn' type="button" onClick={() => setDeleteForm(true)} />
        </IconButton>
      )}
      {/* the confirm delete form. Button click calls delete function and closes the form (false as shown above) and cancel will close the form as well */}
      {deleteForm && (
        <>
          {/* <p className='confirmDeletePostText'>Are you sure you want to delete this post? This is irreversible.</p> */}
          <IconButton className='confirmDeletePostBtn'>
            <DeleteIcon className='deletePostBtn' type="button" onClick={handleDeletePost} />
          </IconButton>
          <IconButton>
            <CancelIcon className='deletePostCancel' type="button" onClick={() => setDeleteForm(false)} />
          </IconButton>
        </>
      )}
      {/* NOT using ToastContainer here since UI for toastify will be called on the Profile jsx, not here */}
    </div>
  )
}

// passing this component to the profile page
export default DeletePost
