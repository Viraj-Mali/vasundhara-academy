'use client';

export default function WhatsAppButton() {
  const phoneNumber = '919881945960';
  const message = encodeURIComponent(
    'Hello! I would like to know more about Vasundhara Academy.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
