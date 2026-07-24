import "../src/index.css";
import Providers from "@/components/providers";

export const metadata = {
  title: "Trenzo",
  description: "Modern fashion shopping experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
