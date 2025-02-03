import RegisterForm from '@/components/ui/forms/registerForm'
import { getUser } from '@/lib/actions/patient.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Register = async ({ params: { userId } }: SearchParamProps) => {

    const user = await getUser(userId);
    console.log(user)
    
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] gap-2 flex-1 flex-col py-10">
                    <Image
                        src={'/assets/icons/logo-full.svg'}
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="h-6 w-fit"
                    />
                    <RegisterForm user={user} />
                </div>
            </section>
            <Image
                src={'/assets/images/register-img.png'}
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[390px] h-fit bg-bottom"
            />
        </div>
    )
}

export default Register