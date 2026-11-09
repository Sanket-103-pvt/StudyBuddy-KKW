// Set this to your Buy Me a Coffee page, e.g. "https://buymeacoffee.com/yourname".
// While it is empty, the /support page shows "Coming soon" instead of a button.
export const BUY_ME_A_COFFEE_URL = "";

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
