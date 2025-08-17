import React from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
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
    Stack,
} from '@mui/material';
import { Form } from '../hook-form/form-provider';
import { useAuthContext, useRouter } from '../hooks';
import { useForm } from 'react-hook-form';
import { Field } from '../hook-form/fields';
import { paths } from '../routes/paths';
import { signInWithPassword } from '../auth/actions';
import { toast } from 'sonner';

const defaultValues = {
    username: '',
    password: '',
};

export const SignInSchema = zod.object({
    username: zod.string().min(1, { message: 'Username is required' }),
    password: zod
        .string()
        .min(4, { message: 'Password must be at least 4 characters!' }),
});

export default function Login() {
    const router = useRouter();
    const { checkUserSession } = useAuthContext()

    const methods = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await signInWithPassword(data)


            if (!response.status) {
                toast.error(response.message)
            }

            await checkUserSession?.()

            router.push(paths.DASHBOARD)
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
                            Welcome to ITask
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" align="center" color="textSecondary">
                            Manage tasks with ease
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
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </LoadingButton>

                            <Typography variant="body2" align="center">
                                Don't have an account?{' '}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => router.push(paths.REGISTER)}
                                >
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Form>
                </CardContent>
            </Card>



        </Container>
    );
}
