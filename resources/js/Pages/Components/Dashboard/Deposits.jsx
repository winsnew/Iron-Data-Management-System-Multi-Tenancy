import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Head } from '@inertiajs/inertia-react';

function preventDefault(event) {
    event.preventDefault();
}

export default function Deposits() {
    return (
        <React.Fragment>
            <Head title="Deposits" />
            <Typography component="p" variant="h4">
                $0
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                on 15 March, 2019
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    View balance
                </Link>
            </div>
        </React.Fragment>
    );
}