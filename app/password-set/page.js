"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { confirmPassword } from "@/firebase/auth/confirmPassword";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function page() {
    const router = useRouter();
    const { toast } = useToast();
    const newPasswordRef = useRef();
    const confirmNewPasswordRef = useRef();

    const handleComfirm = async (e) => {
        e.preventDefault();

        const newPassword = newPasswordRef.current?.value;
        const confirmNewPassword = confirmNewPasswordRef.current?.value;

        if (!newPassword || !confirmNewPassword) {
            toast({
                variant: "destructive",
                description: "fields required",
            });
            return;
        }

        if (newPassword.length < 6 || confirmNewPassword.length < 6) {
            toast({
                variant: "destructive",
                description: "Password must be at least 6 characters long",
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast({
                variant: "destructive",
                description: "Passwords do not match",
            });
            return;
        }
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get("oobCode");

            if (!code) {
                router.push("/employee/dashboard");
                return;
            }

            const response = await confirmPassword(code, newPassword);

            if (response.error === null) {
                toast({
                    description: "Password changed",
                });
                router.push("/employee/dashboard");
            } else {
                toast({
                    variant: "destructive",
                    description: "Error to change password",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Error to change password",
            });
        }
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
                        placeholder="Enter password"
                        ref={newPasswordRef}
                    />
                </div>
                <div>
                    <Input
                        className=""
                        type="password"
                        placeholder="Retype password"
                        ref={confirmNewPasswordRef}
                    />
                </div>
                <Button className="bg-[#3354f4]" onClick={handleComfirm}>
                    Create password
                </Button>
            </form>
        </div>
    );
}
