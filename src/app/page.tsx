import PassKeyModal from "@/components/passKeyModal";
import PatientForm from "@/components/ui/forms/patientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {

  const isAdmin = searchParams?.admin === 'true';

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] gap-2">
          <Image
            src={'/assets/icons/logo-full.svg'}
            height={1000}
            width={1000}
            alt="patient"
            className="h-6 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular flex justify-between mt-1">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 CarePulse
            </p>
            <Link href='/?admin=true' className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>
      <Image
        src={'/assets/images/onboarding-img.png'}
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%] h-fit rounded-tl-2xl rounded-bl-2xl"
      />
    </div>
  );
}
