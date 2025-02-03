"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../customFormField"
import SubmitButton from "../submitButton"
import { UserFormValidation } from "@/lib/formValidations"
import { createUser } from "@/lib/actions/patient.action"
import { useRouter } from "next/navigation"
import { useState } from "react"

export enum formFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}

function PatientForm() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({ email, name, phone }: z.infer<typeof UserFormValidation>) {
        try {
            const payload = {
                email, name, phone
            }
            setLoading(true)
            let res = await createUser(payload);
            if (res) {
                setLoading(false)
                router.push(`/patients/${res.$id}/register`)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex-1">
                <section className="mb-3 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment.</p>
                </section>
                <CustomFormField
                    name="name"
                    fieldType={formFieldType.INPUT}
                    control={form.control}
                    iconSrc="/assets/icons/user.svg"
                    label="FullName"
                />
                <CustomFormField
                    name="email"
                    fieldType={formFieldType.INPUT}
                    control={form.control}
                    iconSrc="/assets/icons/email.svg"
                    label="Email"
                />
                <CustomFormField
                    name="phone"
                    fieldType={formFieldType.PHONE_INPUT}
                    control={form.control}
                    label="Phone"
                />
                <SubmitButton
                    isLoading={loading}
                >
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm
