// src/components/Footer/Footer.tsx
const Footer = () => {
    return (
      <footer
        id="footer"
        style={{
          backgroundColor: "#111",
          color: "var(--color-muted)",
          padding: "4rem 2rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div>
            <h2 style={{ color: "var(--color-primary)", textShadow: "var(--shadow-primary)" }}>⚡ NeonCards</h2>
            <p style={{ maxWidth: 240 }}>The future of digital gifting. Premium gift cards for the digital age.</p>
          </div>
  
          <div>
            <h4 style={{ color: "var(--color-primary)", textShadow: "var(--shadow-primary)", marginBottom: "1rem" }}>Categories</h4>
            <ul>
              <li>Gaming</li>
              <li>Entertainment</li>
              <li>Fashion</li>
              <li>Technology</li>
            </ul>
          </div>
  
          <div>
            <h4 style={{ color: "var(--color-primary)", textShadow: "var(--shadow-primary)", marginBottom: "1rem" }}>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
  
          <div>
            <h4 style={{ color: "var(--color-primary)", textShadow: "var(--shadow-primary)", marginBottom: "1rem" }}>Connect</h4>
            <ul>
              <li>Twitter</li>
              <li>Discord</li>
              <li>Instagram</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
  
        <p style={{ textAlign: "center", marginTop: "3rem", fontSize: "0.875rem", opacity: 0.6 }}>
          © 2024 NeonCards. All rights reserved. Built for the digital future.
        </p>
      </footer>
    );
  };
  
  export default Footer;
  