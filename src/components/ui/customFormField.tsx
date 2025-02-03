import React from 'react'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import { formFieldType } from './forms/patientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectValue } from './select'
import { SelectTrigger } from '@radix-ui/react-select'
import { Textarea } from './textarea'
import { Checkbox } from "@/components/ui/checkbox"


interface CustomFormFieldsProps {
    control: Control<any>,
    name: string,
    fieldType: formFieldType,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderFields = ({ field, props }: { field: any, props: CustomFormFieldsProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, dateFormat, showTimeSelect, renderSkeleton, children } = props;
    switch (fieldType) {
        case formFieldType.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {
                        iconSrc &&
                        <Image
                            src={iconSrc}
                            alt={iconAlt || 'icon'}
                            height={24}
                            width={24}
                            className='ml-2'
                        />
                    }
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='border-none'
                        />
                    </FormControl>
                </div>
            )
        case formFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry='US'
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className='input-phone'
                    />
                </FormControl>
            )
        case formFieldType.DATE_PICKER:
            return (
                <div className='flex rouded-md border border-dark-500 bg-dark-400'>
                    <Image src='/assets/icons/calendar.svg' height={24} width={24} alt='calender' className='ml-2' />
                    <FormControl>
                        <DatePicker
                            className='py-2'
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                        />

                    </FormControl>
                </div>
            )
        case formFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <div>
                                <SelectTrigger className='shad-select-trigger border border-gray-600 flex w-full items-center justify-start p-2'>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </div>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {children}
                        </SelectContent>

                    </Select>
                </FormControl>
            )
        case formFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea disabled={props.disabled} placeholder={placeholder} value={field.value} onChange={field.onChange} className='border-gray-700' />
                </FormControl>
            )
        case formFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-2">
                        <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange} />
                        <label
                            htmlFor={props.name}
                            className="checkbox-label"
                        >
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            )
        case formFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null
        default:
            break;
    }
}

const CustomFormField = (props: CustomFormFieldsProps) => {

    const { control, fieldType, name, label } = props

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== formFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderFields field={field} props={props} />
                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField