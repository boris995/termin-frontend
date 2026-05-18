import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api, unwrap } from '../api/client';
import { Button, Input, Panel } from '../components/ui';

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>({ defaultValues: { email: 'admin@football.com', password: 'admin123' } });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (values: LoginForm) => {
    try {
      const data = unwrap<{ token: string }>(await api.post('/auth/login', values));
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login nije uspio.');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Panel className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Admin ulaz</p>
          <h1 className="mt-2 text-3xl font-black">Football Face-Off</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input type="email" placeholder="Email" {...register('email', { required: true })} />
          <Input type="password" placeholder="Lozinka" {...register('password', { required: true })} />
          {error && <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
          <Button className="w-full" type="submit">
            <LogIn size={18} />
            Login
          </Button>
        </form>
      </Panel>
    </main>
  );
};
