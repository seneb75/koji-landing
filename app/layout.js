import './globals.css';

export const metadata = {
  title: 'Koji - Your trading journey, beautifully tracked',
  description: 'The simple, visual, and affordable trading journal for beginner daytraders, swing traders, and small investors. Track stocks, crypto, forex, options and futures. Under $10/month.',
  keywords: 'trading journal, trade tracker, daytrading, swing trading, forex journal, crypto tracker, trading app, trade log',
  openGraph: {
    title: 'Koji - Your trading journey, beautifully tracked',
    description: 'The simple, visual, and affordable trading journal that makes you want to log every trade.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
