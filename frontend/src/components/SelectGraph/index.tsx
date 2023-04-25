import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

type Props = {
    names: string[];
    selectedGraph: string
    setSelectedGraph(state: string): void
};

const SelectGraph: React.FC<Props> = ({ names, selectedGraph, setSelectedGraph }) => {

    return (

        <Box>
            <Tabs
                value={selectedGraph}>
                {names.map((name, index) => (
                    <Tab value={name} label={name} onClick={() => setSelectedGraph(name)} />
                ))}

            </Tabs>
        </Box >
    );
};

export default SelectGraph;
