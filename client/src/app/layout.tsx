import './globals.css'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-red-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">
            🚀 Job Import Admin Panel
          </h1>
          {children}
        </div>
      </body>
    </html>
  );
}
