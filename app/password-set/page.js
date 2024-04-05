"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmPassword } from "@/firebase/auth/confirmPassword";
import { auth } from "@/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
    const handleComfirm = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const queryParams = new URLSearchParams(window.location.search);
                const code = queryParams.get("oobCode");
                
                if (code) {
                    console.log("Authorization Code:", code);
                    const res = await confirmPassword(code);
                    console.log(res);
                }
            } else {
                // Handle scenario when there is no authenticated user
                router.push("/login");
            }
        });
    };

    return (
        <div className="w-full flex justify-center items-center">
            <form className=" bg-white p-10 mt-36 flex flex-col gap-5 shadow sm:p-6 md:p-8">
                <h5 className="text-xl text-[#4c4a4a] text-center">
                    Set Password
                </h5>

                <div>
                    <Input
                        className=" placeholder:text-[#ddd]"
                        type="password"
                        placeholder="Retype password"
                    />
                </div>
                <div>
                    <Input
                        className=""
                        type="password"
                        placeholder="Enter password"
                    />
                </div>
                <Button className="bg-[#3354f4]" onClick={handleComfirm}>
                    Create password
                </Button>
            </form>
        </div>
    );
}
