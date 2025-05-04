'use client';
import { Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('Loading');
  return (
    <div className="absolute top-[40%] right-[50%] flex flex-col justify-center items-center">
        <Loader className="text-center text-green animate-spin"></Loader>
        <span className='text-green pt-2'>{t('loading')}</span>
    </div>    
  );
}
