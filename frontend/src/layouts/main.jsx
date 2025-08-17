import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthContext, useRouter } from '../hooks'
import { paths } from '../routes/paths'

export default function MainLayout({ sx }) {

    const { authenticated } = useAuthContext()

    const router = useRouter()

    // FORCE REDIRECT TO LOGIN
    if (!authenticated) {
        router.replace(paths.LOGIN)
    }

    return (
        <Box sx={{ mt: 2, ...sx }}>
            <Outlet />
        </Box>
    )
}
