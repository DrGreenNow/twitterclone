'use client';

import React from 'react';
import { submitTweet } from '@/lib/supabase/queries';
import { toast } from 'sonner';

const ComposeTweet = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmitTweet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await submitTweet(formData);
      toast.success('Tweet sent successfully!');
      formRef.current?.reset();
    } catch (error) {
      console.log(error, 'handle submit tweet error');
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmitTweet}
      className="flex flex-col w-full h-full">
      <div>
        <input
          type="text"
          name="tweet"
          placeholder="What's happening?"
          className="w-full h-full placeholder:text-gray-600 bg-transparent outline-none border-none p-4"
        />
      </div>
      <div className="w-full justify-end items-center flex">
        <div className="w-full max-w-20">
          <button
            type="submit"
            className="w-full h-9 rounded-full bg-gray-500 px-4 hover:bg-primary/70 transition duration-100 font-bold text-black">
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComposeTweet;
