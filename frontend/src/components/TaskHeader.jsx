import { Badge, Stack, Typography } from '@mui/material'
import React from 'react'
import * as T from 'prop-types'
///rfc



TaskHeader.propTypes = {
    content: T.string.isRequired,
    title: T.string.isRequired,
    color: T.oneOf(['secondary', 'default', 'success', 'warning', 'error', 'primary']),
};
export default function TaskHeader({ content, color,title }) {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Badge color={color} badgeContent={content}>
                <Typography variant="h6">{title}</Typography>
            </Badge>
        </Stack>
    )
}
