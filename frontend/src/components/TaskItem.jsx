import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    Divider,
} from "@mui/material";
import { fDateTime, fIsAfter } from "../utilities/format-time";

const PriorityChip = ({ priority }) => {
    const color =
        priority === "High"
            ? "error"
            : priority === "Medium"
                ? "warning"
                : "default";
    return <Chip label={priority} color={color} size="small" />;
};

const StatusColor = ({ status }) => {
    const color =
        status === "TODO"
            ? "info"
            : status === "IN_PROGRESS"
                ? "warning"
                : "success";
    return color;
};

const statuses = [
    'DONE',
    'IN_PROGRESS',
    'TODO'
]

export const TaskItem = ({ task, onDelete, onStatusChange }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
            <Stack direction="row" justifyContent='space-between'>
                <Stack direction="row" spacing={1} mb={1}>
                    <PriorityChip priority={task?.priority} />
                    {fIsAfter(task?.dueDate, new Date()) && <Chip label="Overdue" color="error" size="small" /> || <Chip label="On-Time" color="success" size="small" />}
                </Stack>
                {/* <StatusChip status={task?.status} /> */}
            </Stack>

            <Typography variant="h6" gutterBottom>
                {task?.title}
            </Typography>
            <Typography variant="body2" sx={{ minWidth: 280, maxWidth: 500, mb: 2 }} color="text.secondary" gutterBottom>
                {task.description}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant="caption" color="text.secondary">
                    {fDateTime(task.createdOn)}
                </Typography>
                {task?.assigneeId && <Chip size="small" color="default" label={task?.assigneeUsername} /> || <Button variant="contained" size="small">+ ASSIGN</Button>}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" mt={2}>
                <Button
                    color="error"
                    onClick={() => onDelete(task.id)}
                    variant="outlined"
                    size="small"
                >
                    Delete
                </Button>
            </Stack>
            <Stack direction='row' sx={{ mt: 4 }} spacing={1}>
                {statuses.map((status) => <Chip size="small" onClick={() => onStatusChange(task.id, status)} color={status === task?.status && StatusColor(task) || 'default'} label={status} />)}
                {/* <StatusChip status={task?.status} /><StatusChip status={task?.status} /><StatusChip status={task?.status} /> */}
            </Stack>
        </CardContent>
    </Card>
);