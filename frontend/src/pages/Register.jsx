import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Link,
} from '@mui/material';
import { Form } from '../hook-form/form-provider';
import { useRouter } from '../hooks';
import { useForm } from 'react-hook-form';
import { Field } from '../hook-form/fields';
import { paths } from '../routes/paths';
import { LoadingButton } from '@mui/lab';
import { registerOnITask } from '../auth/actions';
import { toast } from 'sonner';

const defaultValues = {
  username: '',
  email: '',
  password: '',
};

export const RegisterSchema = zod.object({
  username: zod.string().min(1, { message: 'Username is required' }),
  email: zod.string().email({ message: 'Invalid email address' }),
  password: zod
    .string()
    .min(4, { message: 'Password must be at least 4 characters!' }),
});

export default function Register() {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await registerOnITask(data)

      toast.success(response.message)

      router.push(paths.LOGIN)
    } catch (error) {
      toast.error(error.message)
    }
  });


  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Card
        sx={{
          width: '100%',
          padding: 3,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" align="center">
              Create an Account
            </Typography>
          }
          subheader={
            <Typography variant="body2" align="center" color="textSecondary">
              Join ITask and manage your tasks efficiently
            </Typography>
          }
        />
        <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Field.Text
                name="username"
                label="Username"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Field.Text
                name="email"
                label="Email"
                type="email"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Field.Text
                name="password"
                label="Password"
                type="password"
                fullWidth
                placeholder="4+ characters"
                InputLabelProps={{ shrink: true }}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                loading={isSubmitting}
                loadingIndicator='Registering...'
              >
                Register
              </LoadingButton>

              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => router.push(paths.LOGIN)}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
}
