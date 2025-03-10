import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Contact = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

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
              'No Subject'
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
