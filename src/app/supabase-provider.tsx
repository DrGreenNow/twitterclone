'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { Dialog, DialogContent } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Toaster, toast } from 'sonner';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

type SupabaseContextType = {
  supabase: SupabaseClient<Database>;
};

export const MainContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    supabase.auth.getSession().then((res) => {
      if (!res.data.session) {
        // TODO. check. it is not working
        // setIsOpen(true);
        console.log(res, 'session');
        return;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <MainContext.Provider value={{ supabase }}>
      {/* TODO do we need provider here? */}
      <>
        <Toaster />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="p-6">
            <DialogTitle className="text-lg my-4">
              Please sign in to continue
            </DialogTitle>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);

                // first check if the username exists or not
                const { data } = await supabase
                  .from('profiles')
                  .select()
                  .eq('username', username.trim());

                if (data && data?.length > 0) {
                  return toast.error(
                    'username already exists, please use another'
                  );
                }

                await supabase.auth.signInWithOtp({
                  email: email.trim(),
                  options: {
                    data: {
                      username,
                    },
                  },
                });

                setIsLoading(false);
              }}>
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="username"
                min={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="my-2"
              />
              <p className="text-sm text-gray-900 my-2">
                you will receive a login magic link!
              </p>
              <div className="flex w-full justify-end">
                <Button disabled={isLoading}>Login</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {children}
      </>
    </MainContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(MainContext);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
