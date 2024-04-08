"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getEmployeeByEmail } from "@/firebase/firebase-admin/getEmployeeByEmail";
import { useRef } from "react";

export default function forgotPassword() {
    const emailRef = useRef();
    const {toast} = useToast()
    const checkEmailExists = async () => {
        const email = emailRef.current?.value;
        if (!email) {
            toast({
                description :"field required",
                variant: "destructive",

            })
        }
        // console.log(email);
        const response = await getEmployeeByEmail(email);
        // console.log(response);
    };
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Find your account</CardTitle>
                <CardDescription>
                    Please enter your email to search for your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Input
                                placeholder="Enter your email"
                                ref={emailRef}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={checkEmailExists}>Deploy</Button>
            </CardFooter>
        </Card>
    );
}
