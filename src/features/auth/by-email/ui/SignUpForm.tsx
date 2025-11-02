'use client';

import { useAuthByEmail } from '@features/auth/by-email';
import { Button } from '@shared/shadcn/ui/button';
import { Input } from '@shared/shadcn/ui/input';

export const SignUpForm = () => {
  const { signUp, signUpState } = useAuthByEmail()

  return (
    <div className='flex flex-col gap-3'>
      <Input/>
      <Input/>
      <Button
        className='mt-2 rounded-full'
        disabled={signUpState.isLoading}
        onClick={() => signUp({
          email: 'test112322211232332@gmail.com',
          password: 'tst_12A@@@',
          first_name: 'Test',
        })}
      >
        Register
      </Button>
    </div>
  )
}