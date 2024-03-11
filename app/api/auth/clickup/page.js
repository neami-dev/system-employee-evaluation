"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClickupTokenHandler from './exchangeToken/page';

export default function ClickupCallback() {
    const route = useRouter();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        if (code) {
            console.log("Authorization Code:", code);
            exchangeCodeForToken(code);
        }
    }, []); 


  async function exchangeCodeForToken(code) {
    
    const dataToken = await ClickupTokenHandler(code);

    if (dataToken) {
        // console.log("accessToken good: ");
        route.push('/employee/profile');
        
    } else {
        console.error('Token exchange failed');
        // route.push('/auth/loginPage');
    }
  }

  return <div>Authorizing...</div>;
}
