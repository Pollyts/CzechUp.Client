import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Устанавливаем переменную окружения для всех запросов
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Отключаем проверку SSL в dev-среде
}

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const config: NextConfig = {
  // Здесь может быть еще твоя конфигурация
};

export default withNextIntl(config);