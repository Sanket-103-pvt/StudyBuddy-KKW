// Set this to your Buy Me a Coffee page, e.g. "https://buymeacoffee.com/yourname".
// Only a small backup link on /support (minimum payment there is about $1); the UPI QR is the main way to pay.
export const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/sanketchaudhari.in";

export const SUPPORT_LINKS = {
  linkedin: "https://www.linkedin.com/in/sanketchaudhari1035/",
  instagram: "https://www.instagram.com/sanket_.103",
  github: "https://github.com/sanket1035",
  email: "mailto:Studybuddykkw@gmail.com",
};

// UPI payments (no fee, goes straight to the creator). The QR image is public/upi-qr.png.
export const UPI_ID = "2005-sanket@yescred";
export const UPI_NAME = "Sanket Chaudhari";
export const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`;
