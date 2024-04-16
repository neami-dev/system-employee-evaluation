"use client"
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export async function logout() {
    const route = useRouter()
    c
    signOut(auth)
        .then(() => {
            route.push("/login")
            toast({
                description: "logged out sccessfully",
            });
            deleteCookies()
        })
        .catch((err) => {
            toast({
                variant: "destructive",
                description: "logged out error",
            });
          
            console.log(err);
        });
}
