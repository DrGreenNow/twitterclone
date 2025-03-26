'use client';

import React from 'react';
import { submitTweet } from '@/utils/supabase/queries';
import { toast } from 'sonner';

const ComposeTweet = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmitTweet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await submitTweet(formData);
      if (res?.error) {
        return toast.error(res.error.message);
      }
      toast.success('Tweet sent successfully!');
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
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
          className="w-full h-full placeholder:text-gray-600 bg-transparent outline-none border-none p-4"></input>
      </div>
      <div className="w-full justify-between items-center flex">
        <div className="w-full max-w-[100px]">
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-2 text-lg hover:bg-primary/70 transition duration-100 font-bold">
            Tweet
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComposeTweet;
