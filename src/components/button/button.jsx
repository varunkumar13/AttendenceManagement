import React from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const button = ({ data, style, ...props }) => {
  return (
        <Stack direction="row" >
      <Button variant="contained" style={{style} }{...props}>{data}</Button>
      
    </Stack>

  )
}

export default button