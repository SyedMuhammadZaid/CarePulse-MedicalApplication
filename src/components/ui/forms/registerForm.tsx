'use client'

import React, { useState } from 'react'
import SumitButton from '../submitButton'
import { Form, FormControl } from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { PatientFormValidation } from '@/lib/formValidations';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import CustomFormField from '../customFormField';
import { formFieldType } from './patientForm';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '../label';
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants';
import { SelectItem } from '../select';
import Image from 'next/image';
import FileUploader from '@/components/fileUploader/fileUploader';
import { registerPatient } from '@/lib/actions/patient.action';

const RegisterForm = ({ user }: { user: User }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setLoading(true);
        // Store file info in form data as
        let formData;
        if (
            values.identificationDocument &&
            values.identificationDocument?.length > 0
        ) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            });

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.identificationDocument[0].name);
        }

        try {
            const patient = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument
                    ? formData
                    : undefined,
                privacyConsent: values.privacyConsent,
                treatmentConsent: values.treatmentConsent,
                disclosureConsent: values.disclosureConsent
            };

            const newPatient = await registerPatient(patient);
            if (newPatient) {
                setLoading(false);
                router.push(`/patients/${user.$id}/new-appointment`);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4 flex-1 flex flex-col gap-2">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-4">
                    <div className='mb-2 space-y-1'></div>
                    <h1 className="sub-header">Personal Information</h1>
                </section>
                <CustomFormField
                    name="name"
                    fieldType={formFieldType.INPUT}
                    control={form.control}
                    iconSrc="/assets/icons/user.svg"
                    label="FullName"
                />
                <div className='flex flex-col lg:flex-row gap-4'>
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
                        placeholder='(555) 123-5342'
                    />
                </div>

                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CustomFormField
                        name="birthDate"
                        fieldType={formFieldType.DATE_PICKER}
                        control={form.control}
                        iconSrc="/assets/icons/email.svg"
                        label="Birth Date"

                    />
                    <CustomFormField
                        name="gender"
                        fieldType={formFieldType.SKELETON}
                        control={form.control}
                        label="Gender"
                        renderSkeleton={(field) => {
                            return (
                                <FormControl>
                                    <RadioGroup defaultValue="comfortable" className='flex h-11 gap-4 xl:justify-between' onValueChange={field.onChange} defaultChecked={field.value}>
                                        {
                                            GenderOptions.map((gender) => {
                                                return (
                                                    <div className="radio-group">
                                                        <RadioGroupItem value={gender} id={gender} />
                                                        <Label htmlFor={gender} className=' cursor-pointer'>{gender}</Label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            )
                        }}
                    />
                </div>

                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CustomFormField
                        name="address"
                        fieldType={formFieldType.INPUT}
                        control={form.control}
                        label="Address"
                        placeholder='14th street, New York'
                    />
                    <CustomFormField
                        name="occupation"
                        fieldType={formFieldType.INPUT}
                        control={form.control}
                        label="Occupation"
                    />
                </div>

                <div className='flex flex-col lg:flex-row gap-4'>
                    <CustomFormField
                        name="emergencyContactName"
                        fieldType={formFieldType.INPUT}
                        control={form.control}
                        label="Emergency contact name"
                        placeholder="Guardian's name"
                    />
                    <CustomFormField
                        name="emergencyContactNumber"
                        fieldType={formFieldType.PHONE_INPUT}
                        control={form.control}
                        label="Emergency contact number"
                        placeholder='(555) 123-5342'
                    />
                </div>

                <section className="space-y-4">
                    <div className='mb-2 space-y-1'></div>
                    <h1 className="sub-header">Medical Information</h1>
                </section>

                <CustomFormField
                    name="primaryPhysician"
                    fieldType={formFieldType.SELECT}
                    control={form.control}
                    label="Primary Physician"
                    placeholder='Select a physician'
                >
                    {
                        Doctors.map((doctor) => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className='flex cursor-pointer items-center gap-2'>
                                    <Image
                                        src={doctor.image}
                                        width={32}
                                        height={32}
                                        alt={doctor.name}
                                        className='rounded-full border border-dark-500'
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))
                    }
                </CustomFormField>

                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CustomFormField
                        name="insuranceProvider"
                        fieldType={formFieldType.INPUT}
                        control={form.control}
                        label="Insurance Provider"
                        placeholder='BlueCross BlueShield'
                    />
                    <CustomFormField
                        name="insurancePolicyNumber"
                        fieldType={formFieldType.INPUT}
                        control={form.control}
                        label="Insurance policy number"
                        placeholder='ABC123456789'
                    />
                </div>

                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CustomFormField
                        name="allergies"
                        fieldType={formFieldType.TEXTAREA}
                        control={form.control}
                        label="Allergies (if any)"
                        placeholder='Peanuts, Pollen'
                    />
                    <CustomFormField
                        name="currentMedication"
                        fieldType={formFieldType.TEXTAREA}
                        control={form.control}
                        label="Current Medication"
                        placeholder='Paracetamol 500mg'
                    />
                </div>

                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CustomFormField
                        name="familyMedicalHistory"
                        fieldType={formFieldType.TEXTAREA}
                        control={form.control}
                        label="Family medical history"
                        placeholder='mother had brain cancer, father had heart disease'
                    />
                    <CustomFormField
                        name="pastMedicalHistory"
                        fieldType={formFieldType.TEXTAREA}
                        control={form.control}
                        label="Past medical history"
                        placeholder='Appendectomy, Tonsillectomy'
                    />
                </div>

                <section className="space-y-4">
                    <div className='mb-2 space-y-1'></div>
                    <h1 className="sub-header">Identification and Verification</h1>
                </section>

                <CustomFormField
                    name="identificationType"
                    fieldType={formFieldType.SELECT}
                    control={form.control}
                    label="Identification type"
                    placeholder='Select an identification type'
                >
                    {
                        IdentificationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))
                    }
                </CustomFormField>

                <CustomFormField
                    name="identificationNumber"
                    fieldType={formFieldType.INPUT}
                    control={form.control}
                    label="Identification number"
                    placeholder='ABCD1234567'
                />

                <CustomFormField
                    name="identificationDocument"
                    fieldType={formFieldType.SKELETON}
                    control={form.control}
                    label="Scanned copy of identification Document"
                    renderSkeleton={(field) => {
                        return (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )
                    }}
                />

                <section className="space-y-4">
                    <div className='mb-2 space-y-1'></div>
                    <h1 className="sub-header">Consent and Privacy</h1>
                </section>

                <CustomFormField
                    fieldType={formFieldType.CHECKBOX}
                    control={form.control}
                    name='treatmentConsent'
                    label='I consent to treatment'
                />
                <CustomFormField
                    fieldType={formFieldType.CHECKBOX}
                    control={form.control}
                    name='disclosureConsent'
                    label='I consent to discolsure of information'
                />
                <CustomFormField
                    fieldType={formFieldType.CHECKBOX}
                    control={form.control}
                    name='privacyConsent'
                    label='I consent to privact policy'
                />

                <SumitButton
                    isLoading={loading}
                >
                    Get Started
                </SumitButton>
            </form>
        </Form>
    )
}

export default RegisterForm