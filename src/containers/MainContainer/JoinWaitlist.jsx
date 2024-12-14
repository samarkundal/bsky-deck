'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

export default function JoinWaitlist() {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const added = localStorage.getItem('bskydeck-waitlist-added');
    if (!added) {
      setTimeout(() => {
        setShowing(true);
      }, 5000);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    const { name, email } = data;
    axios.post('/api/waitlist', { name, email }).then((res) => {
      localStorage.setItem('bskydeck-waitlist-added', true);
      toast.success('Added to waitlist successfully');
      setShowing(false);
    });
  };

  if (!showing) {
    return '';
  }

  return (
    <div className="signup-waitlist-modal-wrapper">
      <motion.div
        className="signup-waitlist-modal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="close-icon">
          <TbX onClick={() => setShowing(false)} size={24} strokeWidth={1.5} />
        </div>
        <div className="form-info">
          <h4>Join the BskyDeck Waitlist</h4>
          <p>
            Sign up to get early access to BskyDeck, the Tweetdeck-like app for
            Bluesky.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" placeholder="Name" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Email" required name="email" />
          </div>
          <button type="submit">Join Waitlist</button>
        </form>
      </motion.div>
    </div>
  );
}
