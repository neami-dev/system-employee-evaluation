"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClickupTokenHandler from './_ClickupTokenHandler/page';
import Loading from '@/components/layout/Loading';

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
        console.error(dataToken);
        route.push('/login');
    }
  }

  return <>
    <Loading />
  </>;
}
