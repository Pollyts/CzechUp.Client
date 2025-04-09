import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import SignInForm from "./SignInForm";
import LocaleSwitcher from '../../../components/LocaleSwitcher';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className="bg-slate-850">
      <nav className="container flex justify-between p-2 ml-10 text-white">
        <LocaleSwitcher />
      </nav>
      <div className="flex flex-col items-center justify-center">
        <div className="p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-green mb-4">{t('title')}</h1>
          <SignInForm />
        </div>
        <Link className="text-l font-bold text-green mb-4" href="/registration">{t('registration')}</Link>
      </div>
    </div>

  );
}