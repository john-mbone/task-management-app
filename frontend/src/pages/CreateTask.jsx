import React, { useEffect } from 'react'
import { useAppContext } from '../hooks/use-app-context'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Typography } from '@mui/material'
import { z as zod } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '../hook-form/form-provider';
import { Field } from '../hook-form/fields';
import { LoadingButton } from '@mui/lab';

export const TaskSchema = zod.object({
    title: zod.string().min(3, "Title must be at least 3 characters"),
    description: zod.string().min(10, "Description must be at least 10 characters"),
    assignee: zod.number().min(1, "Please select an assignee"),
    dueDate: zod.string().nonempty("Please provide a date")
});

const defaultValues = {
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
};

export default function CreateTask() {
    const { state, dispatch, createTask } = useAppContext()

    const {  users, open } = state

    const methods = useForm({
        resolver: zodResolver(TaskSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    
    const onClose = (e) => dispatch({ type: "TOGGLE_CREATE", payload: !open });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await createTask(data)
            toast.success(response.message)
            reset()
            onClose()
        } catch (error) {
            toast.error(error.message)
        }
    });

    // useEffect(() => { }, [open])

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <Form methods={methods} onSubmit={onSubmit}>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 3 }}>
                            Please fill in the following information to add a task
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            gap={2}
                            sx={{
                                margin: 'auto',
                                display: 'flex',
                                width: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Field.Text label='Task Title' name='title' />
                            <Field.Text label='Task Description' name='description' />
                            <Field.Text type='date' InputLabelProps={{ shrink: true }} autoFocus label='Due Date' name='dueDate' />
                            <Field.Select
                                name="assignee"
                                label="Assignee"
                                placeholder="Assignee"
                            >
                                <MenuItem value="">Assignee</MenuItem>
                                <Divider sx={{ borderStyle: 'dashed' }} />
                                {users?.data?.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.username}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <LoadingButton type='submit' loading={isSubmitting} variant="contained" autoFocus>
                            Created
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </Dialog>
        </>
    )
}
