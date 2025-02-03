'use client'

import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { decryptKey, encryptKey } from '@/lib/utils';

const PassKeyModal = () => {

    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(false);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");

    const [encryptedKey, setEncryptedKey] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const key = localStorage.getItem('accessKey');
            console.log(localStorage.getItem('test'))
            console.log(key)
            setEncryptedKey(localStorage.getItem('test'));
        }
    }, []);


    const closeModal = () => {
        setOpen(false);
        router.push("/");
    };

    useEffect(() => {
        const accessPassKey = typeof window !== "undefined" ? localStorage.getItem('accesskey') : null;
        if (path) {
            const decryptedKey = accessPassKey && decryptKey(accessPassKey)
            if (decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false)
                setError('')
                router.push('/admin')
            }
            else {
                setOpen(true)
            }
        }
    }, [encryptedKey])

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);
            localStorage.setItem('accesskey', encryptedKey);
            setEncryptedKey(passkey)
        }
        else {
            setError('Invalid passkey, please try again.')

        }
    }


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={20}
                            height={20}
                            onClick={() => closeModal()}
                            className="cursor-pointer"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => setPasskey(value)}
                    >
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot className="shad-otp-slot" index={0} />
                            <InputOTPSlot className="shad-otp-slot" index={1} />
                            <InputOTPSlot className="shad-otp-slot" index={2} />
                            <InputOTPSlot className="shad-otp-slot" index={3} />
                            <InputOTPSlot className="shad-otp-slot" index={4} />
                            <InputOTPSlot className="shad-otp-slot" index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="shad-error text-14-regular mt-4 flex justify-center">
                            {error}
                        </p>
                    )}
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={(e) => validatePasskey(e)}
                        className="shad-primary-btn w-full"
                    >
                        Enter Admin Passkey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PassKeyModal