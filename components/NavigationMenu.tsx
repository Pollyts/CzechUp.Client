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
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 ml-10">
                    <Image src="/logo.png" alt="Logo" width={72} height={72} /> {/* <-- тут */}
                </Link>
                {isRootLocalePath
                    ? ''
                    : <div><header className="p-4 flex justify-between items-center">
                        {isAuthPage && <LocaleSwitcher />}
                        {!isAuthPage && <div><nav className="flex gap-4">
                            {links.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {t(link.label)}
                                </Link>
                            ))}
                        </nav></div>}
                    </header>
                    {/* {isRootLocalePath && !isAuthPage && <div className="p-2"><span>Breadcrumbs</span></div>} */}
                    </div>}
            </div>
            
        </div>
    );
}
