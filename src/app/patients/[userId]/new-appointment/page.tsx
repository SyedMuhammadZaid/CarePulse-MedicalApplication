import { AppointmentForm } from '@/components/ui/forms/appointmentForm';
import { getPatient } from '@/lib/actions/patient.action';
import Image from 'next/image'
import React from 'react'

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {

    const patient = await getPatient(userId);

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[860px] gap-2 flex-1 flex-col py-6">
                    <Image
                        src={'/assets/icons/logo-full.svg'}
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="h-6 w-fit"
                    />

                    <AppointmentForm
                        patientId={patient?.$id}
                        userId={userId}
                        type="create"
                    />

                    {/* <div className="text-14-regular flex justify-between mt-1">
                        <p className="justify-items-end text-dark-600 xl:text-left">
                            © 2025 CarePulse
                        </p>
                    </div> */}
                </div>
            </section>
            <Image
                src={'/assets/images/appointment-img.png'}
                height={1000}
                width={1000}
                alt="appointment"
                className="side-img max-w-[390px] h-fit rounded-tl-2xl rounded-bl-2xl bg-bottom"
            />
        </div>
    )
}

export default NewAppointment