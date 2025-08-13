import React from 'react'
import { useEffect } from 'react';

function MainLayout() {
    const [accesToken, setAccessToken] = React.useState(null);
    useEffect(() => {
        if (token) {
            setAccessToken(token);
        }
    }, []);

  return (
    <div>MainLayout</div>
  )
}

export default MainLayout