import "./WhatsAppButton.css";

function WhatsAppButton() {
  const phone = "254700000000"; // replace with real number
  const message = "Hi, I'm interested in your baby products";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-btn"
    >
      💬
    </a>
  );
}

export default WhatsAppButton;