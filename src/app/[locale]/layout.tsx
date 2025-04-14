import {notFound} from 'next/navigation';
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import {Inter} from 'next/font/google';
import {routing} from '@/i18n/routing';
import '../../styles.css';
import NavigationMenu from '../../../components/NavigationMenu';

type Props = {
  children: ReactNode;
  params: Promise<{locale: Locale}>;
};

const inter = Inter({subsets: ['latin']});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html className="h-full" lang={locale}>
      <body className={'flex h-full flex-col'}>
        <NextIntlClientProvider>
          <NavigationMenu/>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

