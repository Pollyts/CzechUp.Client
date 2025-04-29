'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from 'next-intl';
import Image from "next/image";

const links = [
    { href: "/words", label: "words" },
    { href: "/topics", label: "topics" },
    { href: "/rules", label: "rules" },
    { href: "/exercises", label: "exercises" },
    { href: "/tags", label: "tags" },
];

export default function NavigationMenu() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const isRootLocalePath = /^\/(ru|en|cs)?$/.test(pathname)
    const isAuthPage = pathname?.includes("/registration") || pathname?.includes("/signin");

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 ml-10">
                    <Image src="/logo.png" alt="Logo" width={72} height={72} /> {/* <-- тут */}
                </Link>
                {isRootLocalePath
                    ? ''
                    : <div className="w-full"><header className="p-4 flex justify-between items-center">
                        {!isAuthPage && <div><nav className="flex gap-4">
                            {links.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {t(link.label)}
                                </Link>
                            ))}
                        </nav></div>}
                        <div className="flex items-center mr-10 ml-auto"><LocaleSwitcher />
                        {!isAuthPage &&
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12ZM15.75 8.25C15.75 9.24456 15.3549 10.1984 14.6517 10.9017C13.9484 11.6049 12.9946 12 12 12C11.0054 12 10.0516 11.6049 9.34835 10.9017C8.64509 10.1984 8.25 9.24456 8.25 8.25C8.25 7.25544 8.64509 6.30161 9.34835 5.59835C10.0516 4.89509 11.0054 4.5 12 4.5C12.9946 4.5 13.9484 4.89509 14.6517 5.59835C15.3549 6.30161 15.75 7.25544 15.75 8.25ZM12 15C10.6056 14.9987 9.2301 15.322 7.98226 15.9442C6.73442 16.5664 5.64852 17.4706 4.8105 18.585C5.72269 19.5838 6.8333 20.3811 8.07128 20.9261C9.30926 21.4711 10.6474 21.7517 12 21.75C13.3526 21.7517 14.6907 21.4711 15.9287 20.9261C17.1667 20.3811 18.2773 19.5838 19.1895 18.585C18.3515 17.4706 17.2656 16.5664 16.0177 15.9442C14.7699 15.322 13.3944 14.9987 12 15Z" fill="#2E7758" />
                        </svg>}</div>
                        

                    </header>
                        {/* {isRootLocalePath && !isAuthPage && <div className="p-2"><span>Breadcrumbs</span></div>} */}
                    </div>}
            </div>

        </div>
    );
}
