import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#020103] text-white overflow-hidden">{children}</body>
    </html>
  );
}
