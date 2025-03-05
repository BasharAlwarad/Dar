import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

export const Contact = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          toast.error('User not found');
          return;
        }
        setUser(userSnapshot.data());
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSendEmail = () => {
    const subject = encodeURIComponent(
      searchParams.get('listingId') || 'No Subject'
    );
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:${user?.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Contact</h1>
        <p className="text-lg mb-2">User Name: {user?.name}</p>
        <p className="text-lg mb-2">User Email: {user?.email}</p>
        <p className="text-lg mb-4">User Phone: {user?.phone}</p>
        <form className="space-y-4">
          <div className="form-control">
            <label htmlFor="message" className="label">
              <span className="label-text">Message</span>
            </label>
            <textarea
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered h-24"
              placeholder="Type your message here..."
            ></textarea>
          </div>
          <a
            href={`mailto:${user?.email}?subject=${encodeURIComponent(
              searchParams.get('listingId') || 'No Subject'
            )}&body=${encodeURIComponent(message)}`}
            className="btn btn-primary"
          >
            Send Message
          </a>
        </form>
      </div>
    </div>
  );
};
